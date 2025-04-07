import React from "react";

const CompanyLogos = () => {
  const logos = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcyLmfVn46KtwJXHi3uUCoKLWoCrxWqeGGBA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0FYhw0YXvPvfIHOzyJ3zh_lLXKqJToHNwuA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM2KhDE9DScd2NHeDjJ7uQi_Ypcm3Vu2LEQg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEy1418TkgyUanTG01x-k112sy2f3GU3tzGg&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz6s3WZNZAaKEXsBVRXuMDagabISvp0gqDRw&s",
    "https://www.rapidops.com/mm-images/rapidops-logo-1024x576-2p2n79f1.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtJluxSFlrLGMdEMTUSnvSn2O7YBA33xG8DA&s",
    "https://logowik.com/content/uploads/images/byjus2816.jpg",
    "https://1000logos.net/wp-content/uploads/2021/09/Cognizant-Logo.jpg",
    "https://media.licdn.com/dms/image/v2/D560BAQGhIaoRhDUTDQ/company-logo_200_200/company-logo_200_200/0/1680595990066/gxx_logo?e=2147483647&v=beta&t=4yKeRAEJDBexYjdzFcGJvtBrDy1S9FinjHu0JY7nu6g",
  ];

  return (
    <div className="logos-container bg-gray-800 py-3">
      <div className="flex md:space-x-8 space-x-5">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            className="md:w-28 w-12 h-10 rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyLogos;