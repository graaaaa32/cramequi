import React, { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

function App() {
  const [links, setLinks] = useState<string[]>(['']);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLink = () => {
    if (links.length < 100) {
      setLinks([...links, '']);
    }
  };

  const removeLink = (index: number) => {
    const newLinks = links.filter((_, i) => i !== index);
    if (newLinks.length === 0) {
      setLinks(['']);
    } else {
      setLinks(newLinks);
    }
  };

  const analyzeComplaints = async () => {
    setAnalyzing(true);
    try {
      // Here we would implement the Puppeteer scraping logic
      // For now, we'll just simulate some results
      const mockResults = links.map(link => ({
        url: link,
        summary: 'Análise pendente - Implementação do Puppeteer necessária',
        date: new Date().toISOString(),
      }));
      setResults(mockResults);
    } catch (error) {
      console.error('Error analyzing complaints:', error);
    }
    setAnalyzing(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Análise Reclame Aqui');
    XLSX.writeFile(wb, 'analise-reclame-aqui.xlsx');
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Analisador Reclame Aqui</h1>
      
      <div className="space-y-4 mb-8">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="url"
              value={link}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              placeholder="Cole o link do Reclame Aqui aqui"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeLink(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
              title="Remover link"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={addLink}
          disabled={links.length >= 100}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          <Plus size={20} />
          Adicionar Link
        </button>
        
        <button
          onClick={analyzeComplaints}
          disabled={analyzing || links[0] === ''}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {analyzing ? 'Analisando...' : 'Analisar Reclamações'}
        </button>

        {results.length > 0 && (
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            <Download size={20} />
            Exportar XLSX
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Resultados da Análise</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border-b pb-4">
                <p className="font-medium">URL: {result.url}</p>
                <p className="text-gray-600">{result.summary}</p>
                <p className="text-sm text-gray-500">Data: {new Date(result.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;