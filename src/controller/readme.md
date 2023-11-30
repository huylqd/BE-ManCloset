pdfDoc.text(`ID Hóa Đơn: ${bill?._id}`);
  pdfDoc.text(`Ngày Xuất Hóa Đơn: ${bill?.createdAt}`);
  pdfDoc.text(`Tên người gửi: Man Closet`);
  pdfDoc.text(`Địa chỉ người gửi: ngõ 53 tân triều thanh trì hà nội`);
  pdfDoc.text(`Tên người nhận: ${user?.name}`);
  pdfDoc.text(`Địa chỉ người nhận: ${bill?.shipping_address}`);
  pdfDoc.text(
    `Sản phẩm bao gồm có: ${products
      .map(
        (product) =>
          `${product?.productName} - ${product.size} - ${product.color} - ${product.quantity} - ${product.price}`
      )
      .join(", ")}`);
  pdfDoc.text(
    `Tổng tiền: ${bill.total_price}`,
    { format: { bold: true } }
  );
  products.map((item) => console.log(item))