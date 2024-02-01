import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'react-bootstrap';
import '../styles/table.css';

function Tabla({ onDataFetch }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    fetchData(fileName);
  }, [fileName]);

  const fetchData = async (fileName) => {
    try {
      const url = fileName === '' ? 'http://localhost:4001/files/data' : `http://localhost:4001/files/data?fileName=${fileName}`;
      const response = await fetch(url);

      if (!response) {
        throw new Error('Empty response');
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType) {
        const result = await response.json();
        const filteredData = result.results || [];
        setData(filteredData);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message || error);

      // Manejar el caso de respuesta vacía específicamente
      if (error.message === 'Empty response') {
        setError('Failed to fetch data. The server is unreachable.');
      } else {
        setError('Failed to fetch data. Please try again later or check your server.');
      }
    }
  };


  return (
    <div className="App">
      <h1 className="h1-text">React Test App</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="table-box">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search file name"
            onChange={(e) => setFileName(e.target.value)}
            className="form-control"
            style={{ border: '1px solid #ccc', padding: '5px' }}
          />
        </div>
        <Table striped bordered hover className="Tabla">
          <thead>
            <tr>
              <th>file</th>
              <th>text</th>
              <th>number</th>
              <th>hex</th>
            </tr>
          </thead>
          <tbody>
            {data.map((fileData) => (
              fileData.lines.map((line, index) => (
                <tr key={`${fileData.file}-${index}`}>
                  <td className="table-data">{fileData.file}</td>
                  <td className="table-data">{line.text}</td>
                  <td className="table-data">{line.number}</td>
                  <td className="table-data">{line.hex}</td>
                </tr>
              ))
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default Tabla;
