interface PhotoGalleryItem {
  id: string
  title: string
  category: string
  imageUrl: string
  alt: string
}

const defaultPhotos: PhotoGalleryItem[] = [
  {
    id: 'photo-alpr',
    category: 'KIỂM SOÁT VÀO / RA',
    title: 'Barie ALPR tự động 0.2s',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBVO-WHeMEV7uWeRK-0l5urfQ2TH0q_Oe4hSLxBojWjn4yTcWkJiuP6ZjqC9DngWRtCDZOIB0YUbLithydo1OxsAqpBTFJfar_IiG7mpka7qCPSHdty0Aoh47-JdDRxyK78QsSlEKOjFVKuolMNgTeRd2QbUadYRwL9BA2eY60Ym7TqCopp0YrPc9hPCmN1yirJ6xxysbwFE2v2Vg3eT0X5LaKG0h8sthrq1mciPsfZ',
    alt: 'Cổng kiểm soát barie tự động ALPR tốc độ cao bãi container Tân Cảng Cát Lái',
  },
  {
    id: 'photo-pavement',
    category: 'MẶT BẰNG CHỊU TẢI',
    title: 'Bê tông cốt thép 60 Tấn',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDW8_rpg6EG6YxiK_ruLAek-MgspIHzy8gI4ohLRW6GXilZhxugDJYLiCHZH2tTU6miadFUIvALd9tLwV-QsehOaIxuKPoERSz1ROU-ZvrjhGhuP-UtH057vRRsLLYXVbdKQ2wkERxD0MBLVByYx5W-nts1NLwBVCI_j8WtysUJDKOqaTPaeTpjPbZW9cHl9qEtot44V3PHc6NvPzZmXnoiJMvwHxE_flHHwdfeQSYp',
    alt: 'Mặt bằng bãi đỗ bê tông cốt thép chịu tải trọng nặng 60 tấn',
  },
  {
    id: 'photo-reefer',
    category: 'HẠ TẦNG CHUYÊN DỤNG',
    title: 'Trạm cắm Reefer 380V',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCh_W5Yp6Ue-CFRkMIIEia7xNA6BUjCmeOvcrk3gwL89KfVdRFT8IKf1E1CvZKWl2hmjmG45eDVpg3-24V0FQhEdWgFmRBkM7EUBoxrWbAdpCjIAebDG9-DICYZF_S19ep0MRoQ_t0LMwljMFzuHY3UGm4H0om28ifaKo91P-pSWtfG6a_fjLcyrJkQxP9x8n9WS7UwxDsY7BtkY3-qtVapDVk-AOQOW2CNtRWSezq3',
    alt: 'Trạm cắm nguồn điện Reefer 380V cho container hàng đông lạnh',
  },
]

export function PhotoGallerySection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {defaultPhotos.map((photo) => (
        <div
          key={photo.id}
          className="relative group overflow-hidden rounded-xl bg-slate-100 h-56 border border-slate-200/80 shadow-xs"
        >
          <img
            src={photo.imageUrl}
            alt={photo.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-4 text-white">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-300">
              {photo.category}
            </span>
            <p className="text-sm font-bold leading-snug mt-0.5 text-white drop-shadow-xs">
              {photo.title}
            </p>
          </div>
        </div>
      ))}
    </section>
  )
}
