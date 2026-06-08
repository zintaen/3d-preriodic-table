fetch('https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  }
})
  .then(res => res.json())
  .then(data => console.log(data.Table.Columns))
  .catch(console.error);
