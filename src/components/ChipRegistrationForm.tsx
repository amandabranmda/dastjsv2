import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { SearchBar } from "./chip/SearchBar";
import { ChipRegistrationFormFields } from "./form/ChipRegistrationFormFields";
import { ChipDetails } from "./chip/ChipDetails";
import { Printer } from "lucide-react";
import { usePDF } from "react-to-pdf";

interface ChipDetails {
  numeroChip: string;
  localChip: string;
  statusChip: string;
  responsavelChip: string;
}

export function ChipRegistrationForm() {
  const [searchNumber, setSearchNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [chipExists, setChipExists] = useState(false);
  const [chipDetails, setChipDetails] = useState<ChipDetails[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    numeroChip: "",
    localChip: "",
    statusChip: "",
    responsavelChip: ""
  });

  const resultsRef = useRef<HTMLDivElement>(null);
  const { toPDF, targetRef } = usePDF({
    filename: `pesquisa-chips-${searchNumber}.pdf`,
  });

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        clearForm();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, []);

  const clearForm = () => {
    setSearchNumber("");
    setChipExists(false);
    setChipDetails([]);
    setShowRegistrationForm(false);
    setFormData({
      numeroChip: "",
      localChip: "",
      statusChip: "",
      responsavelChip: ""
    });
  };

  const handleSearch = async () => {
    if (!searchNumber.trim()) {
      toast.error("Digite um número, local ou responsável do chip");
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("1-chipsInstancias")
        .select("numeroChip, localChip, statusChip, responsavelChip")
        .or(`numeroChip.ilike.%${searchNumber}%,localChip.ilike.%${searchNumber}%,responsavelChip.ilike.%${searchNumber}%`);

      if (error) throw error;

      if (data && data.length > 0) {
        setChipExists(true);
        setChipDetails(data);
        setShowRegistrationForm(false);
      } else {
        setChipExists(false);
        setChipDetails([]);
        setShowRegistrationForm(true);
        setFormData({ ...formData, numeroChip: searchNumber });
      }
    } catch (error) {
      console.error("Erro ao buscar chip:", error);
      toast.error("Erro ao buscar chip. Tente novamente.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.numeroChip || !formData.localChip || !formData.statusChip) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const { error } = await supabase
        .from("1-chipsInstancias")
        .insert([formData]);

      if (error) throw error;

      toast.success("Chip cadastrado com sucesso!");
      clearForm();
    } catch (error) {
      console.error("Erro ao cadastrar chip:", error);
      toast.error("Erro ao cadastrar chip");
    }
  };

  const handlePrintPDF = async () => {
    if (!chipDetails.length) {
      toast.error("Nenhum resultado para imprimir");
      return;
    }

    try {
      await toPDF();
      toast.success("PDF gerado e salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar o PDF. Tente novamente.");
    }
  };

  const PDFContent = () => (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      width: '210mm', // A4 width
      minHeight: '297mm', // A4 height
      backgroundColor: 'white',
      margin: '20mm auto',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ 
        fontSize: '14px', 
        marginBottom: '15px', 
        color: '#000',
        borderBottom: '1px solid #ccc',
        paddingBottom: '5px'
      }}>
        Relatório de Chips
      </h1>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        pageBreakInside: 'auto'
      }}>
        {chipDetails.map((chip, index) => (
          <div 
            key={chip.numeroChip} 
            style={{ 
              color: '#000',
              padding: '2px 4px',
              borderBottom: '1px solid #eee',
              pageBreakInside: 'avoid',
              breakInside: 'avoid-page',
              fontSize: '10px',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1px',
              marginBottom: '2px'
            }}
          >
            <p style={{ margin: '0' }}>Número do Chip: {chip.numeroChip}</p>
            <p style={{ margin: '0' }}>Local: {chip.localChip || '-'}</p>
            <p style={{ margin: '0' }}>Responsável: {chip.responsavelChip || '-'}</p>
          </div>
        ))}
      </div>
      <p style={{ 
        fontSize: '8px', 
        color: '#666',
        position: 'relative',
        marginTop: '20px'
      }}>
        Gerado em: {new Date().toLocaleDateString()}
      </p>
    </div>
  );

  return (
    <div className="w-full">
      <Card className={`p-4 sm:p-6 ${showRegistrationForm ? 'bg-gradient-to-br from-emerald-900/20 to-emerald-800/10' : 'bg-gradient-to-br from-sky-900/20 to-sky-800/10'} backdrop-blur-sm transition-colors duration-300`}>
        <div className="flex flex-col space-y-4">
          <SearchBar 
            searchNumber={searchNumber}
            setSearchNumber={setSearchNumber}
            handleSearch={handleSearch}
            isSearching={isSearching}
            clearForm={clearForm}
            showRegistrationForm={showRegistrationForm}
          />

          {chipExists && chipDetails.length > 0 && (
            <div className="mt-4 space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-red-200">
                  {chipDetails.length === 1 
                    ? "Este número já consta no banco de dados"
                    : `Foram encontrados ${chipDetails.length} resultados`}
                </p>
                <Button
                  onClick={handlePrintPDF}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-sky-400 hover:text-sky-300 border-sky-400/50 hover:border-sky-300/50"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir PDF
                </Button>
              </div>
              <div className="space-y-6">
                {chipDetails.map((chip) => (
                  <ChipDetails 
                    key={chip.numeroChip}
                    numeroChip={chip.numeroChip}
                    localChip={chip.localChip} 
                    statusChip={chip.statusChip}
                    responsavelChip={chip.responsavelChip}
                    onUpdate={handleSearch}
                  />
                ))}
              </div>
              <div style={{ position: 'absolute', left: '-9999px' }}>
                <div ref={targetRef}>
                  <PDFContent />
                </div>
              </div>
            </div>
          )}

          {showRegistrationForm && (
            <ChipRegistrationFormFields
              formData={formData}
              setFormData={setFormData}
              onRegister={handleRegister}
              searchNumber={searchNumber}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
