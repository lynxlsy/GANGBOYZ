"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase-config";
import { collection, addDoc, getDocs, doc, setDoc } from "firebase/firestore";

export default function TestFirebasePage() {
  const [connectionStatus, setConnectionStatus] = useState<string>("Verificando...");
  const [testData, setTestData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test Firestore connection
        if (db && db.type !== 'mock-db') {
          // Try to access a test collection
          const testCollection = collection(db, 'test-connection');
          await getDocs(testCollection);
          setConnectionStatus("✅ Conectado ao Firestore com sucesso!");
          
          // Test creating a document
          const docRef = await addDoc(collection(db, "test-data"), {
            name: "Test Document",
            timestamp: new Date().toISOString()
          });
          console.log("Documento criado com ID: ", docRef.id);
          
          // Test reading documents
          const querySnapshot = await getDocs(collection(db, "test-data"));
          const data: any[] = [];
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setTestData(data);
        } else {
          setConnectionStatus("⚠️ Firebase não está disponível (usando mock)");
        }
      } catch (error) {
        console.error("Erro ao testar conexão:", error);
        setConnectionStatus(`❌ Erro na conexão: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste de Conexão com Firebase</h1>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Status da Conexão</h2>
          <p className={`text-lg ${connectionStatus.includes("✅") ? "text-green-400" : connectionStatus.includes("⚠️") ? "text-yellow-400" : "text-red-400"}`}>
            {loading ? "⏳ Carregando..." : connectionStatus}
          </p>
        </div>
        
        {testData.length > 0 && (
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Dados de Teste</h2>
            <div className="space-y-4">
              {testData.map((item) => (
                <div key={item.id} className="bg-gray-800 p-4 rounded">
                  <p><strong>ID:</strong> {item.id}</p>
                  <p><strong>Nome:</strong> {item.name}</p>
                  <p><strong>Timestamp:</strong> {item.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 text-gray-400">
          <p>Esta página é apenas para testes de desenvolvimento.</p>
        </div>
      </div>
    </div>
  );
}