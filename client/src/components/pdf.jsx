import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfMake/build/vfs_fonts';

function financeiroPDF(financeiro) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const reportTitle = {
        text: 'Financeiro',
        fontSize: 15,
        bold: true,
        margin: [15, 20, 0, 45] // left, top, right, bottom
    };

    const dados = financeiro.map((financeiro) => {
        return [
            { text: financeiro.idFinanceiroGrupoPedido.toString(), fontSize: 9, margin: [0, 2, 0, 2] },
            { text: financeiro.idGrupoPedido.toString(), fontSize: 9, margin: [0, 2, 0, 2] },
            { text: financeiro.dataPagamento.toString(), fontSize: 9, margin: [0, 2, 0, 2] },
            { text: `R$ ${financeiro.valorPedido.toFixed(2)}`, fontSize: 9, margin: [0, 2, 0, 2] }, // Format valorPedido with R$
        ];
    });

    const detalhes = [
        {
            table: {
                headerRows: 1,
                widths: ['*', '*', '*', '*'], // Adjust according to your column count
                body: [
                    [
                        { text: 'ID', style: 'tableHeader', fontSize: 10 },
                        { text: 'N°Pedido', style: 'tableHeader', fontSize: 10 },
                        { text: 'Data de Pagamento', style: 'tableHeader', fontSize: 10 },
                        { text: 'Total do Pedido', style: 'tableHeader', fontSize: 10 },
                    ],
                    ...dados
                ]
            },
            layout: 'lightHorizontalLines'
        }
    ];

    function Rodape(currentPage, pageCount) {
        return [
            {
                text: currentPage.toString() + '/' + pageCount.toString(),
                alignment: 'right',
                fontSize: 9,
                margin: [0, 10, 20, 0] // left, top, right, bottom
            }
        ];
    }

    const docDefinitions = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40], // left, top, right, bottom

        header: [reportTitle],
        content: [detalhes],
        footer: Rodape
    };

    pdfMake.createPdf(docDefinitions).download();
}

export default financeiroPDF;
