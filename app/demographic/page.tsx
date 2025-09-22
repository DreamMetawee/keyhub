import { SubscriptionForm } from "../components/form/demoform";
import { NextPage } from "next";

const DemographicPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#0e1420] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">กรอกข้อมูลผู้ใช้</h1>
      <SubscriptionForm />
    </div>
  );
};

export default DemographicPage;
