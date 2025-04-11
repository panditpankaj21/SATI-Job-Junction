import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CompanyLogos from "../components/CompanyLogos";
import InterviewExperienceForm from "../components/InterviewExperienceForm";
import AllInterviewExperiences from "../components/AllInterviewExperiences";
import Sidebar from "../components/Sidebar";
import OtpVerificationModal from "../components/OtpVerificationModal";
import { useState } from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [oldTitle, setOldTitle] = useState('')
  const [oldExperience, setOldExperience] = useState('')
  const [oldCompanyName, setOldCompanyName] = useState('')
  const [id, setId] = useState(null)

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleUpdateExperience = (id, oTitle, oExperience, oCompanyName) => {
    setId(id);
    setOldTitle(oTitle)
    setOldCompanyName(oCompanyName)
    setOldExperience(oExperience)
    setIsUpdateModalOpen(true);
  }

  const handleAddExperience = () => {
    setIsFormModalOpen(true);
  };

  const handleVerifyRequest = (email) => {
    setUserEmail(email);
    setIsOtpModalOpen(true);
  };

  const closeFormModal = () => {
    setIsUpdateModalOpen(false)
    setIsFormModalOpen(false);
  };

  const closeOtpModal = () => {
    setIsOtpModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-800">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <CompanyLogos />
        <div className="flex flex-col md:flex-row bg-gray-800 text-white">
          <div className="flex justify-center md:flex-none">

            <Sidebar
              onSearch={handleSearch}
              onAddExperience={handleAddExperience}
              onVerifyRequest={handleVerifyRequest}
            />
          </div>
          <AllInterviewExperiences
            searchQuery={searchQuery}
            updateExperience={handleUpdateExperience}
          />
        </div>
        <Footer />
      </div>

      {/* Interview Experience Form Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto styled-scrollbar ">
            <InterviewExperienceForm
              onClose={closeFormModal}
            />
          </div>
        </div>
      )}


      {/* Update Interview Experience modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex justify-center items-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto styled-scrollbar">
            <InterviewExperienceForm
              onClose={closeFormModal}
              oldCompanyName={oldCompanyName}
              oldTitle={oldTitle}
              oldExperience={oldExperience}
              isUpdate={true}
              id={id}
            />
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {isOtpModalOpen && (
        <OtpVerificationModal
          email={userEmail}
          onClose={closeOtpModal}
        />
      )}

    </div>
  );
}