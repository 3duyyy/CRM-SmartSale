export const leadEmailTemplates = {
  default: ({ name, company, value }) => {
    const companySection = company ? `<p>Chúng tôi rất vui khi được liên hệ với bạn và công ty <strong>${company}</strong>.</p>` : ''

    return {
      subject: `Thông báo từ SmartSale!`,
      html: `
        <p>Xin chào <strong>${name}</strong>!</p>
        ${companySection}
        <p>Chúng tôi xin giới thiệu cơ hội hợp tác với giá trị <strong>$${value.toLocaleString()}</strong>.</p>
        <p>Vui lòng phản hồi lại email này nếu bạn quan tâm.</p>
        <p>Trân trọng,<br/><i>SmartSale Team</i></p>
        `
    }
  },

  da_chot: ({ name }) => ({
    subject: `Cảm ơn bạn đã hợp tác cùng SmartSale!`,
    html: `
        <p>Xin chào <strong>${name}</strong>!</p>
        <p>Chúng tôi xin chân thành cảm ơn bạn vì đã tin tưởng và lựa chọn SmartSale..</p>
        <p>Hy vọng sẽ tiếp tục được đồng hành cùng bạn trong những cơ hội tiếp theo.</p>
        <p>Trân trọng,<br/><i>SmartSale Team</i></p>
        `
  }),

  da_huy: ({ name }) => ({
    subject: `Thông báo từ SmartSale!`,
    html: `
      <p>Xin chào <strong>${name}</strong>,</p>
      <p>Chúng tôi rất tiếc khi chưa thể đồng hành cùng bạn trong lần này.</p>
      <p>Nếu có bất kỳ thay đổi nào hoặc cơ hội mới, hãy liên hệ lại với chúng tôi bất kỳ lúc nào.</p>
      <p>Trân trọng,<br/><i>SmartSale Team</i></p>
    `
  })
}
