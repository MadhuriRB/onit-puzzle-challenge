import React, { useState } from "react";
import { JSONTree } from "react-json-tree";
import { fetchIsAConcepts } from "./api/conceptAPI";

interface State {
  loading: boolean;
  error?: string;
  data?: any;
}

interface Props {
  onSubmit: (data: any) => void;
}

const ConceptNetSearchForm = ({ onSubmit }: Props) => {
  const [state, setState] = useState<State>({ loading: false });
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchTermSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm) {
        setState({ loading: true });

        try {
        const data = await buildConceptTree(searchTerm);
        onSubmit(data);
        setState({ loading: false, data });
        } catch (error) {
        if (error instanceof Error) {
            setState({ loading: false, error: error.message });
        } else {
            setState({ loading: false, error: 'unknown error' });
        }
        }
    } else {
        setState({ loading: true, error: 'empty string'});
    }
  };

  async function buildConceptTree(searchTerm: string): Promise<any> {
    const rootConcept = { label: searchTerm, language: 'en' };
    const parentConcepts = await fetchIsAConcepts(searchTerm);
    return { [searchTerm]: { ...rootConcept, ...parentConcepts } };
  }

  return (
    <form onSubmit={handleSearchTermSubmit}>
      <input type="text" value={searchTerm} required onChange={handleSearchTermChange} />
      <button type="submit" disabled={state.loading} style={{marginLeft: '10px'}}>
        {state.loading ? 'Loading...' : 'Search'}
      </button>
      {state.error && <p>Error: {state.error}</p>}
    </form>
  );
};

interface ConceptNetSearchProps {}

// eslint-disable-next-line no-empty-pattern
const ConceptNetSearch = ({}: ConceptNetSearchProps) => {
  const [data, setData] = useState<any>(null);

  const handleSubmit = (data: any) => {
    setData(data);
  };

  return (
    <div style={{margin: '20px'}}>
      <ConceptNetSearchForm onSubmit={handleSubmit} />
      <div>{data && <JSONTree data={data} />}</div>
    </div>
  );
};

export default ConceptNetSearch;

