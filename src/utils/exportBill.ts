import { IOrder } from "../interface/order";
import { ProductItem } from "../interface/product";

export function generateHeader(doc) {
    doc
        // .image("logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("MAN-CLOSET", 110, 57)
        .fontSize(10)
        .text("Man-Closet", 200, 50, { align: "right" })
        .text(removeAccents("số nhà 110 ngõ 80 xuân phương"), 200, 65, { align: "right" })
        .text(removeAccents("Nam Từ Liêm Hà Nội"), 200, 80, { align: "right" })
        .moveDown();
}

export function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Payment is due within 15 days. Thank you for your business.",
            50,
            780,
            { align: "center", width: 500 }
        );
}
export function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}
export function formatCurrency(cents: number) {
    const resultCost = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cents);
    return resultCost
}

export function formatDate(date: Date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}
export function generateCustomerInformation(doc, invoice: IOrder) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Id:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice._id, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice.total_price),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(`UserName: ${removeAccents(invoice?.userName)}`, 300, customerInformationTop)
        .font("Helvetica-Bold")
        .text(`Address: ${removeAccents(invoice.shipping_address)}`, 300, customerInformationTop + 15)

        .moveDown();

    generateHr(doc, 252);
}


export function generateTableRow(
    doc,
    y,
    item,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y, { with: 200, height: 100 })
        .text(unitCost, 280, y, { width: 90, align: "right", height: 100 })
        .text(quantity, 370, y, { width: 90, align: "right", height: 100 })
        .text(lineTotal, 0, y, { align: "right", height: 100 });
}
export function removeAccents(str: string) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}


export function generateInvoiceTable(doc, product: ProductItem[], invoice) {
    let i = 0
    let totalPrice = 0
    for (i = 0; i < product.length; i++) {
        const item = product[i];
        console.log("quantity:", item)
        totalPrice += item.subTotal;
        const position = 330 + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            removeAccents(item.productName),
            formatCurrency(item.subTotal / item.quantity),
            item.quantity,
            formatCurrency(item.subTotal)
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = 330 + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "Subtotal",
        "",
        formatCurrency(invoice.total_price)
    );

    doc.font("Helvetica");
}


