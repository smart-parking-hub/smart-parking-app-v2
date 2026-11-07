import { Building2, Code2, Anchor } from 'lucide-react'

export function AboutLeadershipSection() {
  const leaders = [
    {
      name: 'Nguyễn Hoàng Nam',
      role: 'Founder & Chief Executive Officer',
      bio: '15 năm kinh nghiệm điều hành logistics tại Tân Cảng (SNP). Nguyên giám đốc vận hành trung tâm phân phối và cảng cạn ICD miền Nam.',
      badge: 'Cựu Giám Đốc Khai Thác Tân Cảng',
      icon: Building2,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDizQuBZtnDQXCTjwhCDSA8Bxr3O_ZGZtYd2o5EIZptm7kNVqOS_btv4J7dx6_wJIARa5ta_Bdm0Jq2a4F_hw2_SMne-l9QmZW2BA6WyMcu-4uQACEYbDmJUFBQarwppFi-WR3Zk-GbpAGfg15z34KYAAewUqm2OA9DN0_wbW42W5TbbA5wVucN2ZdUpjqY41FJNw-5iwoSY2EZGQfl6fcF3J8d2e_ovI5yYOiodjt4',
      alt: 'Chân dung chuyên gia nam người Việt Nam khoảng 42 tuổi, phong thái quyết đoán và chuyên nghiệp, mặc áo sơ mi tối màu đứng trước trung tâm điều hành cảng biển hiện đại, ánh sáng tự nhiên rõ nét',
    },
    {
      name: 'Trần Bảo Long',
      role: 'Co-Founder & Chief Technology Officer',
      bio: 'Chuyên gia hệ thống phân tán và thị giác máy tính ALPR. Từng dẫn dắt đội ngũ kỹ sư hạ tầng giao thông thông minh tại Viettel Post và FPT Software.',
      badge: 'Cựu Kỹ sư trưởng Viettel Post',
      icon: Code2,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ0NeNd-GL2R17RF57vzmnQMSaLGPbN1Jfndylm3Xw9lonCOFs_wLPlLdQ4LsJJdB7dk1MJA3spNuQ7O0HuSECFI6Yn4G7vX83HzdHNJ3NLjeInVO5LmkCQbScunGg75XAzVqS1dNFziKktA5WJ8_jZi3ijuc4qCXf-spZSD5Cpe62w-Pk1NGStqHx7B3x6Po4_cb8IxhMoR7tp-dKqZMiogQAfjZWmpKnJ3Hrn21f',
      alt: 'Chân dung kỹ sư nam trưởng công nghệ khoảng 38 tuổi, vẻ ngoài điềm tĩnh, đeo kính kim loại thanh mảnh, nền phía sau là màn hình hiển thị mã nguồn và sơ đồ vi mạch kiến trúc đám mây',
    },
    {
      name: 'Đặng Quốc Hưng',
      role: 'Senior Supply Chain Advisor',
      bio: 'Hơn 22 năm giữ cương vị cố vấn chiến lược và hoạch định mạng lưới luân chuyển vỏ container cho tập đoàn vận tải đường biển Maersk Line khu vực Đông Nam Á.',
      badge: 'Cố vấn cấp cao cựu Maersk Line',
      icon: Anchor,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuALlvjLDgXQfgy2D4eE5VM4aY7LafNX_BIgIuQaM20mEniR8vzRCKWMzBb9eX_qBilohsHbpc3gNIEdh-DBHXvT4bkOYooZQUgZ4bstd6E1ccI6IdvTDynOR40ZRIHeY8fakgr-ZpHLKfjhkIFrus8tuEB5Fx3DyS6g44Gi9ujn8fXIjIqZ9xJ43aAHZUIbzL2NgQVR5fjM_H2Jh9VFZVQmk7o9-jDXIUzYIjr_-JjO',
      alt: 'Chân dung cố vấn nam kỳ cựu khoảng 50 tuổi, trang phục vest lịch lãm không cà vạt, bối cảnh văn phòng vận tải quốc tế nhìn ra bến cảng container sầm uất với cẩu giàn khổng lồ',
    },
  ]

  return (
    <section className="w-full bg-[#060D1A] text-white py-24 px-6 lg:px-12 flex justify-center border-t border-slate-800">
      <div className="max-w-[1240px] w-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="font-mono text-xs text-[#d95f00] uppercase tracking-widest block mb-2 font-semibold">
              ĐỘI NGŨ CHUYÊN GIA
            </span>
            <h2 className="font-sora font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Ban Lãnh Đạo &amp; Cố Vấn Logistics
            </h2>
          </div>
          <p className="text-base text-slate-300 max-w-md font-normal leading-relaxed">
            Sự kết hợp giữa các kỹ sư phần mềm hạ tầng phân tán và chuyên gia điều hành chuỗi cung ứng với hàng thập kỷ thực chiến.
          </p>
        </div>

        {/* 3 Leadership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leaders.map((leader) => {
            const Icon = leader.icon
            return (
              <div
                key={leader.name}
                className="flex flex-col bg-slate-900 rounded border border-slate-800 overflow-hidden shadow-sm"
              >
                <div
                  className="w-full h-72 bg-cover bg-center"
                  role="img"
                  aria-label={leader.alt}
                  style={{ backgroundImage: `url('${leader.image}')` }}
                />
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-sora font-bold text-lg sm:text-xl text-white mb-1">
                      {leader.name}
                    </h3>
                    <div className="font-mono text-xs text-[#d95f00] uppercase tracking-wider mb-4 font-semibold">
                      {leader.role}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                      {leader.bio}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-800 text-xs text-slate-400 font-medium">
                    <Icon className="w-4 h-4 text-[#d95f00]" aria-hidden="true" />
                    <span>{leader.badge}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
