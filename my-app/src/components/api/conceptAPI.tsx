interface Concept {
    label: string;
    language: string;
  }
  
  export async function fetchIsAConcepts(concept: string, isAConcepts: Concept[] = []) {
    const response = await fetch(`api/conceptnet?term=${encodeURIComponent(concept)}&offset=0&limit=100`);
    const { edges } = await response.json();
  
    const parentEdges = edges.filter((edge: { start: { label: string; language: string; }; rel: { label: string; }; }) => edge.start.language === 'en' && edge.rel.label === 'IsA');
    const parentConcepts = parentEdges.map((edge: { end: any; start: any; surfaceText: any}) => ({
      end: edge.end,
      start: edge.start,
      surfaceText: edge.surfaceText
    }));
    
    isAConcepts.push(...parentConcepts);
  
    for (const parent of parentConcepts) {
      await fetchIsAConcepts(parent.label, isAConcepts);
    }
    return isAConcepts;
  }