// ============================================================
// Bộ câu hỏi đánh giá nhân sự - Trích xuất từ file Excel 2025
// 8 loại vị trí, mỗi loại có bộ tiêu chí riêng
// ============================================================

export const ROLE_TYPES = {
  CMO: { key: 'CMO', label: 'Giám đốc Y khoa (CMO)', shortLabel: 'CMO', color: '#7c3aed' },
  LEADER_KHOA: { key: 'LEADER_KHOA', label: 'Trưởng Khoa', shortLabel: 'Leader Khoa', color: '#0369a1' },
  LEADER_PHONG: { key: 'LEADER_PHONG', label: 'Trưởng Phòng', shortLabel: 'Leader Phòng', color: '#0891b2' },
  CQM: { key: 'CQM', label: 'Quản lý Chất lượng (CQM)', shortLabel: 'CQM', color: '#065f46' },
  DR: { key: 'DR', label: 'Bác sĩ', shortLabel: 'Bác sĩ', color: '#b45309' },
  NUR: { key: 'NUR', label: 'Điều dưỡng / NHS / KTV', shortLabel: 'Điều Dưỡng', color: '#be185d' },
  ADMIN_KD: { key: 'ADMIN_KD', label: 'Hành chính / KD-TT-CSKH', shortLabel: 'Hành chính', color: '#9a3412' },
  FINANCIAL_DUOC: { key: 'FINANCIAL_DUOC', label: 'Tài chính / Dược', shortLabel: 'Tài chính/Dược', color: '#1d4ed8' },
};

export const QUESTIONS = {
  CMO: [
    {
      title: 'I- CHẤT LƯỢNG CHUYÊN MÔN',
      items: [
        'Tuân thủ thực hiện đúng tất cả Quy trình của BV và không có sai sót được ghi nhận, báo cáo... dưới mọi hình thức',
        'Trực tiếp hoặc hướng dẫn ít nhất 1 đề tài, công trình NCKH, hay cải tiến chất lượng cấp BV, cấp sở, cấp trường được chấp duyệt',
        'Tổ chức CME mời chuyên gia tuyến trên báo cáo đạt số lượng chỉ tiêu quy định',
        'Tổ chức hoặc trực tiếp thực hiện đạt chỉ tiêu các hoạt động sinh hoạt chuyên môn: CME, bình bệnh án, toa thuốc, tập huấn',
        'Sai sót chuyên môn KCB toàn BV ≤ 2%',
        'Điều hành và tham gia đầy đủ các cuộc họp giao ban khoa và BV',
        'Báo cáo sự cố y khoa tự nguyện (Sự cố xảy ra trong BV xem là sự cố y khoa)',
      ],
    },
    {
      title: 'II- CHẤT LƯỢNG LAO ĐỘNG',
      items: [
        'Tuân thủ thực hiện đúng tất cả phân công của lãnh đạo',
        'Đảm bảo ngày công (không đi trễ-về sớm)',
        'Không đọc báo, không làm việc riêng trong giờ khám bệnh của BV',
        'Thường xuyên truy cập các trang Web chuyên ngành, thư viện...để cập nhật kiến thức phục vụ chuyên môn.',
        'Không đi ra ngoài hoặc đi căn tin trong giờ làm việc',
        'Không nghỉ đột xuất không phép',
        'Chấp hành 100% bảng phân công công việc hàng tuần',
        'Không đùn đẩy trách nhiệm (làm việc có tâm và vì tinh thần khách hàng là trên hết)',
        'Số ngày nghỉ phép < số ngày không nghỉ phép',
      ],
    },
    {
      title: 'III- XÂY DỰNG THƯƠNG HIỆU (Y HIỆU) TÂM TRÍ',
      items: [
        'Tôn trọng nhân cách người bệnh để được tôn trọng (không xung đột với khách hàng bất cứ lí do nào)',
        'Tôn trọng nhân cách đồng nghiệp để được tôn trọng (không tạo ra môi trường bất hòa)',
        'Phong cách lịch sự, nhã nhặn, sạch sẽ',
        'Khắc phục ngay sự cố y khoa được báo cáo',
        'Giải thích tư vấn, giải quyết cho người bệnh và thân nhân rõ ràng, không bị thắc mắc, phản ảnh',
        'Không sai sót trong nhận dạng thương hiệu: trang phục, giao tiếp, phát ngôn, gian lận...',
        'Tạo môi trường làm việc thân thiện, chuyên nghiệp và hiệu quả',
      ],
    },
    {
      title: 'IV- KHẢ NĂNG LÃNH ĐẠO',
      items: [
        'Khả năng tổ chức quản lý các bộ phận được phân công',
        'Tinh thần trách nhiệm tốt (vì trách nhiệm, vì công việc là trên hết)',
        'Thực hiện hợp tác phối hợp tốt với tất cả các khoa phòng để đạt hiệu quả công việc tốt',
        'Mức độ tín nhiệm của mọi thành viên đồng nghiệp và khách hàng có liên quan',
        'Tỷ lệ nhân viên thuộc phạm vi quản lý đạt xuất sắc cao, cũng như nhân viên chưa tốt thấp',
        'Tỷ lệ thời lượng dành cho quản lý > thời lượng trực tiếp làm chuyên môn',
        'Đạt chỉ tiêu bài viết đăng letter và web của bệnh viện',
        'Điểm của kỳ thi về quản lý do BV phối hợp với trường tổ chức',
        'Tỷ lệ BS viết bài đăng báo trong và ngoài nước',
        'Tổ chức được HNKH hàng năm',
        'Có đơn khiếu kiện của khách hàng, của nhân viên',
        'Báo cáo thiếu chính xác',
        'Báo cáo không kịp thời',
        'Chấp hành tốt đối với lãnh đạo công ty trong quản lý (qua điều hành, quy chế, quy trình, điều lệ)',
        'Kết quả đạt KPI của các khoa được phân công phụ trách (Dựa vào trị số % trung bình đạt KPI của các khoa để chấm điểm này)',
        'Kết quả đạt chỉ tiêu (KPI) được giao cho CMO',
      ],
    },
    {
      title: 'V- QUẢN LÝ VỀ CHI PHÍ ĐẦU TƯ',
      items: [
        'Điều hành sử dụng thuốc vật tư tiêu hao hợp lý, hiệu quả, tất cả đều có đề xuất và được phê duyệt mua sắm theo quy định trước khi BS chỉ định sử dụng (không có dấu tiêu cực hoặc không rõ ràng trong kê đơn, trình dược, nhà thuốc bên ngoài BV, Cty dược...)',
        'Sử dụng dụng cụ, tài sản đúng mục tiêu, đúng công năng, không hư hao lãng phí, mất mát...',
        'Thực hiện đầy đủ, đúng quy trình sử dụng bảo quản dụng cụ trang thiết bị được giao cho các bộ phận sử dụng',
        'Có kế hoạch sử dụng, tái sử dụng VTYT, thuốc hóa chất đúng quy định hạn chế lãng phí, giá thành cao',
        'Có giám sát và xử lý việc BS sử dụng các CLS, thuốc, VTYT không cần thiết, hoặc quá mức quy định gây phát sinh chi phí cho người bệnh',
        'Tự giải quyết các vấn đề ngoài quyền hạn chuyên môn',
      ],
    },
  ],

  LEADER_KHOA: [
    {
      title: 'I- CHẤT LƯỢNG CHUYÊN MÔN',
      items: [
        'Tuân thủ thực hiện đúng tất cả Quy trình của BV (hoặc không có sai sót được ghi nhận)',
        'Trực tiếp thực hiện hoặc có hướng dẫn ít nhất 1 đề tài, công trình NCKH, hay cải tiến chất lượng cấp BV, cấp sở, cấp trường được chấp duyệt',
        'Tham gia CME được BV tổ chức',
        'Có trực tiếp thực hiện ít nhất 1 CME, bình bệnh án, toa thuốc, tập huấn',
        'Sai sót chuyên môn KCB ≤ 2%',
        'Tham dự đầy đủ các cuộc họp giao ban khoa và BV',
        'Báo cáo sự cố y khoa tự nguyện (Sự cố xảy ra trong BV xem là sự cố y khoa)',
      ],
    },
    {
      title: 'II- CHẤT LƯỢNG LAO ĐỘNG',
      items: [
        'Tuân thủ thực hiện đúng tất cả phân công của lãnh đạo',
        'Đảm bảo ngày công (không đi trễ-về sớm)',
        'Không đọc báo, không làm việc riêng trong giờ khám bệnh của BV',
        'Thường xuyên truy cập các trang Web chuyên ngành, thư viện...để cập nhật kiến thức phục vụ chuyên môn.',
        'Không đi ra ngoài hoặc đi căn tin trong giờ làm việc',
        'Không nghỉ đột xuất không phép',
        'Chấp hành 100% bảng phân công công việc hàng tuần',
        'Không đùn đẩy trách nhiệm (làm việc có tâm và vì tinh thần khách hàng là trên hết)',
        'Số ngày nghỉ phép < số ngày không nghỉ phép',
      ],
    },
    {
      title: 'III- XÂY DỰNG THƯƠNG HIỆU (Y HIỆU) TÂM TRÍ',
      items: [
        'Tôn trọng nhân cách người bệnh để được tôn trọng (không xung đột với khách hàng bất cứ lí do nào)',
        'Tôn trọng nhân cách đồng nghiệp để được tôn trọng (không tạo ra môi trường bất hòa)',
        'Phong cách lịch sự, nhã nhặn, sạch sẽ',
        'Khắc phục ngay sự cố y khoa được báo cáo',
        'Giải thích tư vấn cho người bệnh và thân nhân rõ ràng, không bị thắc mắc, phản ảnh',
        'Không sai sót trong nhận dạng thương hiệu: trang phục, giao tiếp, phát ngôn, gian lận...',
        'Tạo môi trường làm việc thân thiện, chuyên nghiệp và hiệu quả',
      ],
    },
    {
      title: 'IV- KHẢ NĂNG LÃNH ĐẠO',
      items: [
        'Kết quả hoạt động của khoa (Dựa vào % đạt KPI để chấm điểm này)',
        'Khả năng tổ chức quản lý đơn vị',
        'Báo cáo thiếu chính xác',
        'Báo cáo không kịp thời',
        'Sử dụng dụng cụ, tài sản đúng mục tiêu, đúng công năng, không hư hao lãng phí, mất mát...',
        'Thực hiện đầy đủ, đúng quy trình sử dụng bảo quản dụng cụ trang thiết bị được giao cho các bộ phận sử dụng',
        'Tinh thần hợp tác phối hợp với các khoa phòng khác',
        'Mức độ tín nhiệm của mọi thành viên đồng nghiệp và khách hàng có liên quan',
        'Tỷ lệ nhân viên của khoa đạt xuất sắc cao, cũng như nhân viên chưa tốt thấp',
      ],
    },
  ],

  LEADER_PHONG: [
    {
      title: 'I- CHẤT LƯỢNG CHUYÊN MÔN-KỸ THUẬT',
      items: [
        'Tuân thủ thực hiện đúng tất cả Quy trình của BV (hoặc không có sai sót được ghi nhận)',
        'Không đùn đẩy trách nhiệm (làm việc có tâm và vì tinh thần khách hàng là trên hết)',
        'Thực hiện đạt 100% lịch phân công và trách nhiệm được giao, có vi phạm',
        'Công tác chuyên môn, nghiệp vụ tốt, 100% công việc có kế hoạch trước',
        'Tham dự đầy đủ các cuộc họp giao ban của bộ phận và BGĐ',
        'Báo cáo sự cố y khoa tự nguyện (Sự cố xảy ra trong BV xem là sự cố y khoa)',
        'Tiết kiệm vật tư điện, nước, vật liệu',
        'Không để xảy ra thất thoát tài sản BV',
      ],
    },
    {
      title: 'II- CHẤT LƯỢNG LAO ĐỘNG',
      items: [
        'Tuân thủ thực hiện đúng tất cả phân công của lãnh đạo',
        'Đảm bảo ngày công (không đi trễ-về sớm)',
        'Không đọc báo, không làm việc riêng trong giờ khám bệnh của BV',
        'Thường xuyên truy cập các trang Web chuyên ngành, thư viện...để cập nhật kiến thức phục vụ chuyên môn.',
        'Không đi ra ngoài hoặc đi căn tin trong giờ làm việc',
        'Không nghỉ đột xuất không phép',
        'Chấp hành 100% bảng phân công công việc hàng tuần',
        'Số ngày nghỉ phép < số ngày không nghỉ phép',
        'Lòng nhiệt tình và tận tụy trong công việc',
      ],
    },
    {
      title: 'III- XÂY DỰNG THƯƠNG HIỆU (Y HIỆU) TÂM TRÍ',
      items: [
        '100% Có nụ cười trong lúc phục vụ người bệnh',
        '100% người bệnh được hướng dẫn tận tình, chính xác, đến nơi đến chốn, có văn hóa nhân ái',
        'Không có ý kiến phê phán, chê trách bằng miệng hoặc bằng thư về thái độ của mình',
        'Phong cách, bảng tên, quần áo, y phục, giầy dép, tóc...gọn sạch, đẹp, lịch sự, không xung đột với khách hàng với bất cứ lí do nào',
        'Tôn trọng nhân cách đồng nghiệp để được tôn trọng (không tạo ra môi trường bất hòa)',
        'Khắc phục ngay sự cố y khoa được báo cáo',
        'Không sai sót trong nhận dạng thương hiệu: trang phục, giao tiếp, phát ngôn, gian lận...',
      ],
    },
    {
      title: 'IV- KHẢ NĂNG LÃNH ĐẠO',
      items: [
        'Kết quả hoạt động của phòng (Dựa vào % đạt KPI để chấm điểm này)',
        'Khả năng tổ chức quản lý đơn vị',
        'Báo cáo thiếu chính xác',
        'Báo cáo không kịp thời',
        'Tinh thần hợp tác phối hợp với các khoa phòng khác',
        'Mức độ tín nhiệm của mọi thành viên đồng nghiệp và khách hàng có liên quan',
        'Tỷ lệ nhân viên của phòng đạt xuất sắc cao, cũng như nhân viên chưa tốt thấp',
      ],
    },
  ],

  CQM: [
    {
      title: 'I- CHẤT LƯỢNG CHUYÊN MÔN',
      items: [
        'Tuân thủ thực hiện đúng tất cả Quy trình của BV và không có sai sót được ghi nhận',
        'Trực tiếp hoặc hướng dẫn ít nhất 1 đề tài, công trình NCKH, hay cải tiến chất lượng cấp BV, cấp sở, cấp trường được chấp duyệt',
        'Tổ chức hoặc trực tiếp thực hiện đạt chỉ tiêu các hoạt động sinh hoạt chuyên môn',
        'Điều hành và tham gia đầy đủ các cuộc họp giao ban và BV',
        'Báo cáo sự cố y khoa tự nguyện (Sự cố xảy ra trong BV xem là sự cố y khoa)',
        'Sai sót chuyên môn KCB toàn BV ≤ 2%',
        'Triển khai và duy trì hệ thống quản lý chất lượng toàn bệnh viện',
      ],
    },
    {
      title: 'II- CHẤT LƯỢNG LAO ĐỘNG',
      items: [
        'Tuân thủ thực hiện đúng tất cả phân công của lãnh đạo',
        'Đảm bảo ngày công (không đi trễ-về sớm)',
        'Không đọc báo, không làm việc riêng trong giờ khám bệnh của BV',
        'Thường xuyên truy cập các trang Web chuyên ngành, thư viện...để cập nhật kiến thức phục vụ chuyên môn.',
        'Không đi ra ngoài hoặc đi căn tin trong giờ làm việc',
        'Không nghỉ đột xuất không phép',
        'Chấp hành 100% bảng phân công công việc hàng tuần',
        'Không đùn đẩy trách nhiệm (làm việc có tâm và vì tinh thần khách hàng là trên hết)',
        'Số ngày nghỉ phép < số ngày không nghỉ phép',
      ],
    },
    {
      title: 'III- XÂY DỰNG THƯƠNG HIỆU (Y HIỆU) TÂM TRÍ',
      items: [
        'Tôn trọng nhân cách người bệnh để được tôn trọng (không xung đột với khách hàng bất cứ lí do nào)',
        'Tôn trọng nhân cách đồng nghiệp để được tôn trọng (không tạo ra môi trường bất hòa)',
        'Phong cách lịch sự, nhã nhặn, sạch sẽ',
        'Khắc phục ngay sự cố y khoa được báo cáo',
        'Giải thích tư vấn, giải quyết cho người bệnh và thân nhân rõ ràng, không bị thắc mắc, phản ảnh',
        'Không sai sót trong nhận dạng thương hiệu: trang phục, giao tiếp, phát ngôn, gian lận...',
        'Tạo môi trường làm việc thân thiện, chuyên nghiệp và hiệu quả',
      ],
    },
    {
      title: 'IV- KHẢ NĂNG QUẢN LÝ CHẤT LƯỢNG',
      items: [
        'Kết quả các chỉ số chất lượng BV đạt theo kế hoạch',
        'Khả năng tổ chức, điều phối hoạt động chất lượng các khoa phòng',
        'Báo cáo chất lượng đầy đủ, chính xác và kịp thời',
        'Xây dựng và cập nhật quy trình, chính sách chất lượng BV',
        'Mức độ tín nhiệm của đồng nghiệp và ban giám đốc',
        'Kết quả đạt KPI chất lượng được giao',
      ],
    },
  ],

  DR: [
    {
      title: 'I- CHẤT LƯỢNG CHUYÊN MÔN-KỸ THUẬT',
      items: [
        'Tuân thủ thực hiện đúng tất cả Quy trình của BV (hoặc không có sai sót được ghi nhận)',
        'Không đùn đẩy trách nhiệm (làm việc có tâm và vì tinh thần khách hàng là trên hết)',
        'Thực hiện đạt 100% lịch phân công và trách nhiệm được giao',
        'Có tham gia ít nhất 1 đề tài, công trình NCKH, hay cải tiến chất lượng cấp BV, cấp sở, cấp trường được chấp duyệt',
        'Có tham gia hoặc trực tiếp thực hiện ít nhất 1 CME, bình bệnh án, toa thuốc, tập huấn',
        'Tham dự đầy đủ các cuộc họp giao ban của bộ phận',
        'Báo cáo sự cố y khoa tự nguyện (Sự cố xảy ra trong BV xem là sự cố y khoa)',
        'Sai sót chuyên môn cá nhân = 0',
        'Công tác chuyên môn, nghiệp vụ tốt',
      ],
    },
    {
      title: 'II- CHẤT LƯỢNG LAO ĐỘNG',
      items: [
        'Tuân thủ thực hiện đúng tất cả phân công của lãnh đạo',
        'Đảm bảo ngày công (không đi trễ-về sớm)',
        'Không đọc báo, không làm việc riêng trong giờ khám bệnh của BV',
        'Thường xuyên truy cập các trang Web chuyên ngành, thư viện...để cập nhật kiến thức phục vụ chuyên môn.',
        'Không đi ra ngoài hoặc đi căn tin trong giờ làm việc',
        'Không nghỉ đột xuất không phép',
        'Chấp hành 100% bảng phân công công việc hàng tuần',
        'Số ngày nghỉ phép < số ngày không nghỉ phép',
        'Lòng nhiệt tình và tận tụy trong công việc',
      ],
    },
    {
      title: 'III- XÂY DỰNG THƯƠNG HIỆU (Y HIỆU) TÂM TRÍ',
      items: [
        '100% Có nụ cười trong lúc phục vụ người bệnh',
        '100% người bệnh được hướng dẫn tận tình, chính xác, đến nơi đến chốn, có văn hóa nhân ái',
        'Không có ý kiến phê phán, chê trách bằng miệng hoặc bằng thư về thái độ của mình',
        'Phong cách, bảng tên, quần áo, y phục, giầy dép, tóc...gọn sạch, đẹp, lịch sự, không xung đột với khách hàng với bất cứ lí do nào',
        'Tôn trọng nhân cách đồng nghiệp để được tôn trọng (không tạo ra môi trường bất hòa)',
        'Khắc phục ngay sự cố y khoa được báo cáo',
        'Không sai sót trong nhận dạng thương hiệu: trang phục, giao tiếp, phát ngôn, gian lận...',
      ],
    },
  ],

  NUR: [
    {
      title: 'I- CHẤT LƯỢNG CHUYÊN MÔN-KỸ THUẬT',
      items: [
        'Tuân thủ thực hiện đúng tất cả Quy trình của BV (hoặc không có sai sót được ghi nhận)',
        'Không đùn đẩy trách nhiệm (làm việc có tâm và vì tinh thần khách hàng là trên hết)',
        'Thực hiện đạt 100% lịch phân công và trách nhiệm được giao',
        'Có tham gia ít nhất 1 đề tài, công trình NCKH, hay cải tiến chất lượng cấp BV được chấp duyệt',
        'Có tham gia hoặc trực tiếp thực hiện ít nhất 1 CME, bình toa thuốc, hay sinh hoạt CLB, hoặc họp HĐ người bệnh',
        'Công tác chuyên môn, nghiệp vụ tốt',
        'Tham dự đầy đủ các cuộc họp giao ban của bộ phận',
        'Báo cáo sự cố y khoa tự nguyện (Sự cố xảy ra trong BV xem là sự cố y khoa)',
        'Sai sót kỹ thuật điều dưỡng cá nhân = 0',
      ],
    },
    {
      title: 'II- CHẤT LƯỢNG LAO ĐỘNG',
      items: [
        'Tuân thủ thực hiện đúng tất cả phân công của lãnh đạo',
        'Đảm bảo ngày công (không đi trễ-về sớm)',
        'Không đọc báo, không làm việc riêng trong giờ khám bệnh của BV',
        'Thường xuyên truy cập các trang Web chuyên ngành, thư viện...để cập nhật kiến thức phục vụ chuyên môn.',
        'Không đi ra ngoài hoặc đi căn tin trong giờ làm việc',
        'Không nghỉ đột xuất không phép',
        'Chấp hành 100% bảng phân công công việc hàng tuần',
        'Số ngày nghỉ phép < số ngày không nghỉ phép',
        'Lòng nhiệt tình và tận tụy trong công việc',
      ],
    },
    {
      title: 'III- XÂY DỰNG THƯƠNG HIỆU (Y HIỆU) TÂM TRÍ',
      items: [
        '100% Có nụ cười trong lúc phục vụ người bệnh',
        '100% người bệnh được hướng dẫn tận tình, chính xác, đến nơi đến chốn, có văn hóa nhân ái',
        'Không có ý kiến phê phán, chê trách bằng miệng hoặc bằng thư về thái độ của mình',
        'Phong cách, bảng tên, quần áo, y phục, giầy dép, tóc...gọn sạch, đẹp, lịch sự, không xung đột với khách hàng với bất cứ lí do nào',
        'Tôn trọng nhân cách đồng nghiệp để được tôn trọng (không tạo ra môi trường bất hòa)',
        'Khắc phục ngay sự cố y khoa được báo cáo',
        'Không sai sót trong nhận dạng thương hiệu: trang phục, giao tiếp, phát ngôn, gian lận...',
      ],
    },
  ],

  ADMIN_KD: [
    {
      title: 'I- CHẤT LƯỢNG CHUYÊN MÔN-KỸ THUẬT',
      items: [
        'Tuân thủ thực hiện đúng tất cả Quy trình của BV (hoặc không có sai sót được ghi nhận)',
        'Không đùn đẩy trách nhiệm (làm việc có tâm và vì tinh thần khách hàng là trên hết)',
        'Thực hiện đạt 100% lịch phân công và trách nhiệm được giao, có vi phạm',
        'Công tác chuyên môn, nghiệp vụ tốt, 100% công việc có kế hoạch trước',
        'Tham dự đầy đủ các cuộc họp giao ban của bộ phận',
        'Báo cáo sự cố y khoa tự nguyện (Sự cố xảy ra trong BV xem là sự cố y khoa)',
        'Tiết kiệm vật tư điện, nước, vật liệu',
        'Không để xảy ra thất thoát tài sản BV',
      ],
    },
    {
      title: 'II- CHẤT LƯỢNG LAO ĐỘNG',
      items: [
        'Tuân thủ thực hiện đúng tất cả phân công của lãnh đạo',
        'Đảm bảo ngày công (không đi trễ-về sớm)',
        'Không đọc báo, không làm việc riêng trong giờ khám bệnh của BV',
        'Thường xuyên truy cập các trang Web chuyên ngành, thư viện...để cập nhật kiến thức phục vụ chuyên môn.',
        'Không đi ra ngoài hoặc đi căn tin trong giờ làm việc',
        'Không nghỉ đột xuất không phép',
        'Chấp hành 100% bảng phân công công việc hàng tuần',
        'Số ngày nghỉ phép < số ngày không nghỉ phép',
        'Lòng nhiệt tình và tận tụy trong công việc',
      ],
    },
    {
      title: 'III- XÂY DỰNG THƯƠNG HIỆU (Y HIỆU) TÂM TRÍ',
      items: [
        '100% Có nụ cười trong lúc phục vụ người bệnh',
        '100% người bệnh được hướng dẫn tận tình, chính xác, đến nơi đến chốn, có văn hóa nhân ái',
        'Không có ý kiến phê phán, chê trách bằng miệng hoặc bằng thư về thái độ của mình',
        'Phong cách, bảng tên, quần áo, y phục, giầy dép, tóc...gọn sạch, đẹp, lịch sự, không xung đột với khách hàng với bất cứ lí do nào',
        'Tôn trọng nhân cách đồng nghiệp để được tôn trọng (không tạo ra môi trường bất hòa)',
        'Khắc phục ngay sự cố y khoa được báo cáo',
        'Không sai sót trong nhận dạng thương hiệu: trang phục, giao tiếp, phát ngôn, gian lận...',
      ],
    },
  ],

  FINANCIAL_DUOC: [
    {
      title: 'I- CHẤT LƯỢNG CHUYÊN MÔN-KỸ THUẬT',
      items: [
        'Tuân thủ thực hiện đúng tất cả Quy trình của BV (hoặc không có sai sót được ghi nhận)',
        'Không đùn đẩy trách nhiệm (làm việc có tâm và vì tinh thần khách hàng là trên hết)',
        'Thực hiện đạt 100% lịch phân công và trách nhiệm được giao',
        'Có tham gia ít nhất 1 đề tài, công trình NCKH, hay cải tiến chất lượng cấp BV được chấp duyệt',
        'Có tham gia hoặc trực tiếp thực hiện ít nhất 1 CME, bình toa thuốc, hay sinh hoạt CLB, hoặc họp HĐ người bệnh',
        'Công tác chuyên môn, nghiệp vụ tốt',
        'Tham dự đầy đủ các cuộc họp giao ban của bộ phận',
        'Báo cáo sự cố y khoa tự nguyện (Sự cố xảy ra trong BV xem là sự cố y khoa)',
        'Chế độ tài chính sổ sách, số liệu báo cáo thực hiện không sai số',
      ],
    },
    {
      title: 'II- CHẤT LƯỢNG LAO ĐỘNG',
      items: [
        'Tuân thủ thực hiện đúng tất cả phân công của lãnh đạo',
        'Đảm bảo ngày công (không đi trễ-về sớm)',
        'Không đọc báo, không làm việc riêng trong giờ khám bệnh của BV',
        'Thường xuyên truy cập các trang Web chuyên ngành, thư viện...để cập nhật kiến thức phục vụ chuyên môn.',
        'Không đi ra ngoài hoặc đi căn tin trong giờ làm việc',
        'Không nghỉ đột xuất không phép',
        'Chấp hành 100% bảng phân công công việc hàng tuần',
        'Số ngày nghỉ phép < số ngày không nghỉ phép',
        'Lòng nhiệt tình và tận tụy trong công việc',
      ],
    },
    {
      title: 'III- XÂY DỰNG THƯƠNG HIỆU (Y HIỆU) TÂM TRÍ',
      items: [
        '100% Có nụ cười trong lúc phục vụ người bệnh',
        '100% người bệnh được hướng dẫn tận tình, chính xác, đến nơi đến chốn, có văn hóa nhân ái',
        'Không có ý kiến phê phán, chê trách bằng miệng hoặc bằng thư về thái độ của mình',
        'Phong cách, bảng tên, quần áo, y phục, giầy dép, tóc...gọn sạch, đẹp, lịch sự, không xung đột với khách hàng với bất cứ lí do nào',
        'Tôn trọng nhân cách đồng nghiệp để được tôn trọng (không tạo ra môi trường bất hòa)',
        'Khắc phục ngay sự cố y khoa được báo cáo',
        'Không sai sót trong nhận dạng thương hiệu: trang phục, giao tiếp, phát ngôn, gian lận...',
      ],
    },
  ],
};

// Tính điểm và xếp loại
export function calcGrade(scores, questions) {
  if (!scores || !questions) return { total: 0, max: 0, pct: 0, grade: '-', gradeLabel: '-', gradeColor: '#999' };
  let total = 0;
  let max = 0;
  questions.forEach((cat, ci) => {
    cat.items.forEach((_, ii) => {
      const v = scores[`${ci}_${ii}`];
      if (v !== undefined && v !== '') total += Number(v);
      max += 5;
    });
  });
  const pct = max > 0 ? (total / max) * 100 : 0;
  let grade, gradeLabel, gradeColor;
  if (pct > 80) { grade = 'A'; gradeLabel = 'Xuất sắc'; gradeColor = '#16a34a'; }
  else if (pct > 60) { grade = 'B'; gradeLabel = 'Tốt'; gradeColor = '#2563eb'; }
  else if (pct >= 40) { grade = 'C'; gradeLabel = 'Cần phát triển'; gradeColor = '#d97706'; }
  else { grade = 'D'; gradeLabel = 'Không đạt'; gradeColor = '#dc2626'; }
  return { total, max, pct: Math.round(pct * 10) / 10, grade, gradeLabel, gradeColor };
}

// Danh sách tài khoản quản lý (hardcoded cho demo - production nên dùng DB)
export const MANAGER_ACCOUNTS = [
  { username: 'ceo', password: 'ceo@2025', role: 'council', fullName: 'Ban Giám Đốc / Hội Đồng', department: 'Tất cả' },
  { username: 'leader_khoa', password: 'leader@2025', role: 'leader', fullName: 'Lãnh Đạo Khoa', department: 'Khoa Lâm Sàng' },
  { username: 'leader_phong', password: 'leader@2025', role: 'leader', fullName: 'Lãnh Đạo Phòng', department: 'Phòng Ban' },
  { username: 'admin', password: 'admin@2025', role: 'council', fullName: 'Quản Trị Hệ Thống', department: 'Tất cả' },
];
