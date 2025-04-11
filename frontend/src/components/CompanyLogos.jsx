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
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAllBMVEX///8PXt3///0AWdwAUNoAUtsPXtx3nOnz9/uqwvHi7PsAS9oAWtwAVdvJ2PYJXNxqk+cub+DX5PgTY9/P3fhWh+RJfuOGp+tlkOfp8fvR3/aNq+v///p/o+ru9PvB0/U/eOK2y/JOguSXsu1wmOeeuO4ARtmZtezi6/awx/DB0vE5dOIub94XZd1ci+Slve4AQ9kAO9dR2VGVAAAJFklEQVR4nO2ae3viKhCHDTejgmi8Vest1m5vqz3n+3+5Q2BIyMVqdesfZ+fdfR5tQAg/BpiZpNVCEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARB/u8QQmrfisITRSSjNe93np8/025MlrXyoGK1zWWtm9otXXTnF7RwZUuE9Pdty/652kK8akNRXB1z3DmOej3OFWc99bFKyr2TZ//Dfl3nFPo7yb57qyjzgWtp0L3m16b3DqMW/lAtjCNlSxQvNCGZIvMV5VQLEWX/IiEpm6aZReTm8cBdm71OvcsZ9HeS3viakYRj6v6ClhZXttDhZlwGOagWxSNtSzQNNDG2/6KUK3DoSAjJdt1AtwG1FQTvtGpz/qiiLxH8Rk1arW7PNcWubMloEl2siflYrqdca1Eeh5GF0jRfxl6T6G/QxOyQryMViaaxaPYMq+dv0+R1JE8NRvfeXLW/SxMSD3NJtFDMoGg+GM0Te/ae00SAnWldbEvBBnXtSAruq8k+n2TJR6t0PN48bXmuCt2eXztk1lMFfhnq4Fqvf91ICu6qyTuD+RTqw7sepDvgfpZ556ydkHlSkCqniR4GF5P4upEU3FMT8iH9ml+FvuobnM1CD8+vndC9S8Ds5O/g6u1+7B01Iak3CP4UOO3mawo+jrmLs5qEFJpU6pFWrs1XDRQ+fKlWRZPCkbhQ7e9osqPw96Dq67dhT6Ht72kCfethVRPDOumnaT9ZNwRivkr8Ok7T92ReiatCTWxDm7dNEjcEX7dr8gorR+t1ObwxewpoIod/SJP501Rwxs1/vZ11GwZjBPmcHLipwZj+aI/DODTQhLQ6u4hl1UaT9+Xyj2sCUYBQT/VNYsvdocFfb9bEhA/rtlLSNCGyY1tSfqyqYhSZCQ4RhJkkxbYpyUeca7Ig/SGDWtrEH69ng/LvavIAp4Ts1pomnRXwJzTZ6FJAZZakeq709z7igXdjR3xc1zRJ3rj0x735oHrxbU1ImbImhAxdmCO3DQMlpe/Xa5J11GFmuOX4QbNV6WR6YTIqVxGajnwY6jVRz6ocmWlVn86vNKlunK2qJnPpvE31eK7JmzQhKdOFo5vbAit6zSQp25GzAxnNXTOgiagHZnJ7yT6ba1LrI+sk1GQBovPND2piIioFu4Riw+n0wCT4Puw9r7JhEAuYrURKL5yxlN/LUBMttNUl1I91vqeJFiGmD3/dabIBZ4Kfy17dpsnEH/izVzsTA1/n4P3b+JDfGdcf0yGFGzMB10uoia2huaJcSS+M/PiWJmVJRGF3XhPnsWk6/0FNMhvILkRybOfcrKWOMxzNP6HOioOR0FEn817mj1QKO/4oWpc00ZHadrrz7vMwOx7siNgF+ciTa6cANHnjoPz6XJO3aHK0ZiKMALmTulJQyV4iaw2LS05jm/EkJIEMhuY2XVHYCX+E82LgbYk1pEOv1wQ8e61/zk6Mz+l+mY0/X01+r+f2JCWfzNqw0Ic1/KhF+ioTSsNBkWuiVsSFCGQ5BdVU+/zi+Y4m0NEPrh1vjOopdAz2znaU3S0IjC7iKSlsacecz3gINBFSFMmwMbcnhKaT81FPsJ/ICpU99h0cKZ78mCakBYGT+kwWOcnKXXRGEMMxo0dBj6T/5HhpFZpoug+idzA2Ojl/GheaHKZVRMk/SSADxNMf08SEmc4IBOUeM/kU/Odp+Bv6cLJpv3b4W3Bx4lqW37ETuq8VHco+W+T8E7X6orXz+ZOQ+n4yBOMM/Xb/l6ll2IC/xp9PTnju24cZuwG9QpMz8U52v/Zv+bse7uTx142aFK5HA+7g8Ukcs52caraIAYOLD1docjYGJKB0pJLqDBHyvpscDZMsEPsDmugmpLUTv9WzzcnIvzHP9iOatFw2TdjjrNLuEp6GqkPrtj12KAUsmLom1AYrG/hN4cGUx3NfTdb+OQavGorZa6CR3Y37CRy0tL+e11ln3S4gz0lX5cSW496akAefTStHl8QfoTqyAcct584ezuKStwllbgefg0sgh2H2oLUGWnfWpM+EG7o6hq+REPLpHCITy3Zv1ATuhk5LOfB1HNsB2x3cH01qEVR54m59seTOmvgktbmf7as/Y8wtzyDnJdxQQk3q7+R8pYmZbvDt1Sb3tvJb1PaJB5m50EWYdZobUMvszXYbPmQN3VETs5bzZ16UZplju4I7v302SzNIrcAJpdlbNXdHSu8pNcSA7taFHM3BczcfH9JGM/ahgPEdGcwAXzkXwLS5hwXlNpm7amIsAgzFnD7s92A2a+8oz4MAs6RKmgg5mVVZbb7WZAyy08MCzCCeKOu0ZVkl4qxV+P5ebVzcnXDnT2oXJt5Xk+W0eCvAHI7Kpdf9BTkHY277WlJVYY/BcmrQZJlv5OwhXXST90dd3dkXedRK2e7x5XGXP7GmR3J3TbIXC+gpT1PysV/gT6rxFRU7t2c0IXPtXRSZxTpc+XSJb54U1mqmIZwWMyl2Md1Zk+V62/hOjjaSvOehu0uWXaNJFn/nj+SzzJnPVwue/5CQSaPmsLjuronZIvdMNpgKHy6C4zM6ZUwXaEKyhzJVxSMWxv3xtP5ij5bsDarcVxN7R+mw8gDGOCx8FYcO/6YXneCsJsYWN6JkB5mfz2alp/atQXYLJeHVqO9rnIkBz3KJJrL0Rojp+XOYvZ/kw3rK9b5bekCdPYGhUSNlTVSDJlmo8MCUKEZM2bBffgBOlumBFdakhVL7OK9xsyaf/zBL71jTRDEoqmiSZYWfpprbQj5sb2JSeWhvKjxI1sSvkia/oINDWZMlSfbKyE6lCSsZ322qb1Nk6+dty1wVc5iNZt3gIXr3X9fsP+HamfRcV9MLNJn3gaS2zsa+qCkCJa15shgn3bh2vyBc3F30Gwjfko79xXGtBxL3n1cPx2P7abM+kTxavqaP++NksOpUYtL4HZoN5pIkcG1xwcsFXt+GjpfekWzWxIeijZwqJMtyJf+l+ffF54keGvuBC9Xl9sVgEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBkP8Z/wHwg6icShHc4gAAAABJRU5ErkJggg==",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRt3nA0uZjQw8-ZJhzg7GMRkdjr-1E_qy34NA&s",
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 py-5 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
          Our <span className="text-purple-400">Recruiters</span>
        </h2>
        <div className="relative">
          <div className="flex space-x-8 md:space-x-12 animate-scroll">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="group flex-shrink-0 transform transition-all duration-300 hover:scale-110"
              >
                <img
                  src={logo}
                  alt={`Logo ${index + 1}`}
                  className="w-20 h-16 md:w-32 md:h-20 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 rounded-lg bg-white/5 p-2 backdrop-blur-sm"
                />
              </div>
            ))}
          </div>
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default CompanyLogos;