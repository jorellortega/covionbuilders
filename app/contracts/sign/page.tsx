'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ContractTemplate {
  id: string;
  title: string;
  body: string;
}

interface SignedContract {
  id: string;
  templateId: string;
  templateTitle: string;
  signerName: string;
  signerEmail: string;
  signedAt: string;
}

export default function SignContract() {
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signedContracts, setSignedContracts] = useState<SignedContract[]>([]);

  useEffect(() => {
    const savedTemplates = localStorage.getItem('contractTemplates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
    const savedSignedContracts = localStorage.getItem('signedContracts');
    if (savedSignedContracts) {
      setSignedContracts(JSON.parse(savedSignedContracts));
    }
  }, []);

  const signContract = () => {
    if (!selectedTemplateId || !signerName || !signerEmail) return;
    const template = templates.find(t => t.id === selectedTemplateId);
    if (!template) return;
    const newSignedContract: SignedContract = {
      id: Date.now().toString(),
      templateId: selectedTemplateId,
      templateTitle: template.title,
      signerName,
      signerEmail,
      signedAt: new Date().toISOString(),
    };
    const updatedSignedContracts = [...signedContracts, newSignedContract];
    localStorage.setItem('signedContracts', JSON.stringify(updatedSignedContracts));
    setSignedContracts(updatedSignedContracts);
    setSelectedTemplateId('');
    setSignerName('');
    setSignerEmail('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Contract</h1>
      <div className="mb-4">
        <select
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">Select a Template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>{template.title}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Signer Name"
          value={signerName}
          onChange={(e) => setSignerName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="Signer Email"
          value={signerEmail}
          onChange={(e) => setSignerEmail(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={signContract} className="bg-green-500 text-white p-2 rounded">Sign Contract</button>
      </div>
      <h2 className="text-xl font-bold mb-2">Signed Contracts</h2>
      <ul>
        {signedContracts.map((contract) => (
          <li key={contract.id} className="mb-2 p-2 border">
            <h3 className="font-bold">{contract.templateTitle}</h3>
            <p>Signed by: {contract.signerName} ({contract.signerEmail})</p>
            <p>Signed at: {new Date(contract.signedAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      <Link href="/contracts" className="text-blue-500 underline">Back to Contract Manager</Link>
    </div>
  );
} 