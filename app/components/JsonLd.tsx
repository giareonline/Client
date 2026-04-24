"use client";

export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GiaReViet",
    alternateName: "Gia Re Viet",
    url: "https://giareviet.com",
    description:
      "Hệ thống đặt vé xe khách và homestay giá rẻ nhất Việt Nam. So sánh hàng trăm nhà xe, homestay uy tín.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://giareviet.com/?serviceType={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "GiaReViet",
      logo: {
        "@type": "ImageObject",
        url: "https://giareviet.com/logo.png",
      },
    },
    sameAs: [
      "https://facebook.com/giareviet",
      "https://youtube.com/@giareviet",
    ],
  };

  const businessData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "GiaReViet",
    url: "https://giareviet.com",
    description:
      "Đặt vé xe khách và homestay giá rẻ nhất Việt Nam",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hồ Chí Minh",
      addressCountry: "VN",
    },
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(businessData),
        }}
      />
    </>
  );
}
