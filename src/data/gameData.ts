import { Category } from '../types';

export interface GameHint {
  id: string; // matches book id in booksData.ts
  hints: [string, string, string, string, string]; // 5 hints from hardest to easiest
}

export const GAME_HINTS: GameHint[] = [
  {
    id: 'c1',
    hints: [
      "Một tác phẩm kinh điển về một tâm hồn mộng mơ bị mắc kẹt trong thời đại hiệp sĩ đã qua.",
      "Nhân vật chính cưỡi một con ngựa gầy còm tên là Rocinante.",
      "Vị hiệp sĩ già thường xuyên có những cuộc đối đầu tưởng tượng với những gã khổng lồ.",
      "Bối cảnh diễn ra tại vùng đất khô hạn xứ Mancha, Tây Ban Nha.",
      "Tên sách bắt đầu bằng chữ D."
    ]
  },
  {
    id: 'c5',
    hints: [
      "Một cuộc hành trình kỳ ảo vào thế giới phi logic và đầy rẫy những nghịch lý.",
      "Nơi có một con mèo có thể biến mất chỉ để lại nụ cười và một ông thỏ luôn vội vã.",
      "Mọi chuyện bắt đầu khi nhân vật chính rơi xuống một cái hang sâu bên dưới gốc cây.",
      "Thế giới này bị cai trị bởi một nữ hoàng độc tài yêu thích các lá bài.",
      "Tên sách bắt đầu bằng chữ A."
    ]
  },
  {
    id: 'h1',
    hints: [
      "Tác phẩm được kể qua những dòng nhật ký và thư tín về một thực thể bất tử từ phương Đông.",
      "Một nhân vật có khả năng điều khiển bầy sói và không có bóng dưới ánh trăng.",
      "Huyền thoại khởi nguồn cho mọi nỗi sợ hãi về loài sinh vật hút máu người.",
      "Hành trình từ lâu đài vùng núi Carpath đến thành phố London mù sương.",
      "Tên sách bắt đầu bằng chữ D."
    ]
  },
  {
    id: 'h2',
    hints: [
      "Bi kịch về tham vọng khoa học khi cố gắng vượt qua giới hạn của sự sống và cái chết.",
      "Một sinh linh dị dạng được tạo ra từ những mảnh xác chết và được đánh thức bằng điện.",
      "Tạo vật bị chính người cha đẻ của mình ruồng bỏ vì ngoại hình quái dị.",
      "Lấy tên của chính nhà khoa học đã tạo ra sinh vật đáng thương này.",
      "Tên sách bắt đầu bằng chữ F."
    ]
  },
  {
    id: 'e1',
    hints: [
      "Một lời nhắn gửi chân thành dành cho những người lớn đã quên mất mình từng là trẻ con.",
      "Cậu bé sở hữu một bông hồng đỏ đỏng đảnh trên một hành tinh siêu nhỏ.",
      "Hành trình chu du qua các tiểu tinh cầu để học về tình yêu và sự thuần hóa.",
      "Câu nói nổi tiếng: 'Điều cốt lõi thì mắt trần không thể thấy được'.",
      "Tên sách bắt đầu bằng chữ H."
    ]
  },
  {
    id: 'e2',
    hints: [
      "Câu chuyện về một hành trình đi tìm vàng nhưng lại tìm thấy tiếng nói của vũ trụ.",
      "Nhân vật chính là một cậu bé chăn cừu luôn mơ thấy kho báu ở Kim Tự Tháp.",
      "Một triết lý về định mệnh được tóm gọn qua khái niệm 'Maktub'.",
      "Thông điệp: 'Khi bạn thực sự khao khát điều gì, cả vũ trụ sẽ hợp lực giúp bạn'.",
      "Tên sách bắt đầu bằng chữ N."
    ]
  },
  {
    id: 'h5',
    hints: [
      "Một cuộc đấu trí nghẹt thở giữa một nữ đặc vụ trẻ và một thiên tài biến thái.",
      "Kẻ phản diện có một khả năng thao túng tâm lý cực kỳ đáng sợ trong ngục tối.",
      "Tiếng kêu la của những con vật vô tội trong ký ức là nỗi ám ảnh xuyên suốt câu chuyện.",
      "Tác phẩm nổi tiếng về bác sĩ ăn thịt người Hannibal Lecter.",
      "Tên sách bắt đầu bằng chữ S."
    ]
  },
  {
    id: 'c10',
    hints: [
      "Một bức tranh trào phúng về xã hội Việt Nam thời kỳ Âu hóa rởm đời.",
      "Sự thăng tiến không tưởng của một kẻ hạ lưu nhờ vào sự giả tạo của đám đông.",
      "Câu chuyện về một gã nhặt bóng quần vợt bỗng trở thành vĩ nhân cứu quốc.",
      "Câu nói nổi tiếng: 'Biết rồi, khổ lắm, nói mãi!'.",
      "Tên sách bắt đầu bằng chữ S."
    ]
  },
  {
    id: 'c2',
    hints: [
      "Cuộc hành trình đầy nghịch ngợm của một cậu bé bên bờ sông Mississippi.",
      "Màn kịch quét vôi hàng rào là một bài học kinh điển về tâm lý học.",
      "Đôi bạn thân đã vô tình chứng kiến một vụ án mạng bí ẩn tại nghĩa địa.",
      "Tác phẩm nổi tiếng nhất của nhà văn Mark Twain về tuổi thơ dữ dội.",
      "Tên sách bắt đầu bằng chữ N."
    ]
  },
  {
    id: 'h3',
    hints: [
      "Nỗi ám ảnh kinh hoàng quay trở lại một thị trấn nhỏ sau mỗi chu kỳ 27 năm.",
      "Thực thể tà ác thường xuất hiện dưới hình dạng một gã hề cầm bóng bay màu đỏ.",
      "Nhóm 7 đứa trẻ cô độc phải liên kết lại để đối mặt với nỗi sợ lớn nhất của mình.",
      "Câu chuyện diễn ra tại thị trấn Derry đầy những bí mật đen tối.",
      "Tên sách bắt đầu bằng chữ I."
    ]
  },
  {
    id: 'h10',
    hints: [
      "Vụ án nhuốm màu sắc ma quái nhất trong sự nghiệp của vị thám tử tài ba.",
      "Lời nguyền về một con quái vật phát sáng gieo rắc cái chết trên đồng hoang.",
      "Cuộc điều tra nhằm bảo vệ những người thừa kế cuối cùng của một dòng họ lâu đời.",
      "Sherlock Holmes phải đối mặt với một âm mưu tàn độc ẩn sau những huyền thoại.",
      "Tên sách bắt đầu bằng chữ C."
    ]
  },
  {
    id: 'c9',
    hints: [
      "Câu chuyện về một cô bé thiên tài sở hữu khả năng dịch chuyển đồ vật bằng tâm trí.",
      "Một đứa trẻ bị cha mẹ hắt hủi nhưng lại tìm thấy niềm an ủi trong thư viện sách.",
      "Cuộc đối đầu giữa lòng tốt ngây thơ và sự bạo ngược của bà hiệu trưởng Trunchbull.",
      "Tên nhân vật chính cũng là tiêu đề của tác phẩm nổi tiếng từ Roald Dahl.",
      "Tên sách bắt đầu bằng chữ M."
    ]
  },
  {
    id: 'c6',
    hints: [
      "Một cụ già quyết định thực hiện một hành động bộc phát ngay trong ngày sinh nhật của mình.",
      "Chuyến phiêu lưu kéo theo một chiếc vali tiền và những băng nhóm tội phạm.",
      "Hồi ức về một người đàn ông từng gặp gỡ hầu hết các nguyên thủ quốc gia thế kỷ 20.",
      "Lối thoát duy nhất để bắt đầu cuộc sống mới là trèo qua cửa sổ viện dưỡng lão.",
      "Tên sách bắt đầu bằng chữ O."
    ]
  },
  {
    id: 'h4',
    hints: [
      "Một gia đình bị cô lập trong bão tuyết tại một khách sạn mùa đông đầy ma mị.",
      "Khả năng thấu thị của một đứa trẻ về những oan hồn và tội ác trong quá khứ.",
      "Sự điên loạn dần chiếm lấy người cha dưới áp lực của bóng ma và chứng nghiện rượu.",
      "Từ khóa 'Redrum' là nỗi ám ảnh kinh điển của văn học kinh dị.",
      "Tên sách bắt đầu bằng chữ T."
    ]
  },
  {
    id: 'c8',
    hints: [
      "Thế giới đầy tiếng cười qua lăng kính ngây ngô của một cậu bé học sinh ở Pháp.",
      "Những mẩu chuyện về nhóm bạn tinh nghịch như Alceste háu ăn hay Agnan học sinh cưng.",
      "Tình bạn và những trò quậy phá làm đảo lộn cả ngôi trường và gia đình.",
      "Tên nhân vật chính là một cái tên rất phổ biến ở các nước nói tiếng Pháp.",
      "Tên sách bắt đầu bằng chữ N."
    ]
  }
];
