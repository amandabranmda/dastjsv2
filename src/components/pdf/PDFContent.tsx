interface PDFContentProps {
  chipDetails: Array<{
    numeroChip: string;
    localChip: string;
    responsavelChip: string;
  }>;
}

export function PDFContent({ chipDetails }: PDFContentProps) {
  return (
    <div style={{ 
      padding: '20mm',
      fontFamily: 'Arial, sans-serif',
      width: '210mm',
      minHeight: '297mm',
      backgroundColor: 'white',
      margin: '0',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '10mm'
    }}>
      <h1 style={{ 
        fontSize: '14px', 
        marginBottom: '10mm', 
        color: '#000',
        borderBottom: '1px solid #ccc',
        paddingBottom: '5px'
      }}>
        Relatório de Chips
      </h1>
      
      {chipDetails.map((chip, index) => (
        <div 
          key={chip.numeroChip} 
          style={{ 
            color: '#000',
            padding: '2mm 4mm',
            borderBottom: '1px solid #eee',
            pageBreakInside: 'avoid',
            breakInside: 'avoid',
            fontSize: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1mm',
            marginBottom: index === chipDetails.length - 1 ? '10mm' : '2mm'
          }}
        >
          <p style={{ margin: '0' }}>Número do Chip: {chip.numeroChip}</p>
          <p style={{ margin: '0' }}>Local: {chip.localChip || '-'}</p>
          <p style={{ margin: '0' }}>Responsável: {chip.responsavelChip || '-'}</p>
        </div>
      ))}
      
      <p style={{ 
        fontSize: '8px', 
        color: '#666',
        marginTop: 'auto',
        paddingTop: '5mm'
      }}>
        Gerado em: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}