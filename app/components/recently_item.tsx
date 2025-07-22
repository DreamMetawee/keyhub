// components/RecentlyPlayedItem.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, // faUser ยังคงอยู่ใน import แต่จะไม่ได้ถูกเรียกใช้โดยตรงใน JSX อีกต่อไป
  faPlay,
  faKey,
  faCheckCircle,
  faTimesCircle,
  faCopy,
} from "@fortawesome/free-solid-svg-icons"; // เพิ่ม icon ที่เกี่ยวข้อง

interface RecentlyPlayedItemProps {
  title: string;
  imageUrl: string;
  keyStatus: "activated" | "not-activated"; // สถานะของคีย์เกม
  gameKey?: string; // Optional: คีย์เกมจริง (ถ้าต้องการแสดง)
  subtitle: string; // กลับมาใช้ subtitle
}

const RecentlyPlayedItem: React.FC<RecentlyPlayedItemProps> = ({
  title,
  imageUrl,
  keyStatus,
  gameKey,
  subtitle, // รับ subtitle เข้ามา
}) => {
  // ฟังก์ชันสำหรับ copy key (ตัวอย่าง)
  const handleCopyKey = () => {
    if (gameKey) {
      navigator.clipboard.writeText(gameKey);
      alert("คีย์ถูกคัดลอกแล้ว!");
    }
  };

  let statusText: string;
  let statusIcon;
  let statusColor: string;
  let actionButton;

  switch (keyStatus) {
    case "activated":
      statusText = "Key ถูกเปิดใช้งานแล้ว";
      statusIcon = faCheckCircle;
      statusColor = "text-green-500";
      actionButton = (
        <button
          className="bg-steam-blue hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200"
          disabled // ปิดใช้งานถ้าคีย์เปิดใช้งานแล้ว
        >
          <span>เปิดใช้งานคีย์แล้ว</span> {/* เปลี่ยนเป็นเล่นเกมแทน Play Now */}
        </button>
      );
      break;
    case "not-activated":
      statusText = "พร้อมใช้งาน";
      statusIcon = faKey;
      statusColor = "text-yellow-500";
      actionButton = (
        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center space-x-2 transition-colors duration-200">
          <FontAwesomeIcon icon={faKey} />
          <span>เปิดใช้งานคีย์</span>
        </button>
      );
      break;
    default:
      statusText = "";
      statusIcon = null;
      statusColor = "";
      actionButton = null;
  }

  return (
    <div className="flex items-center bg-steam-card-bg p-4 rounded-lg shadow-md hover:bg-steam-light-bg transition-colors duration-200">
      <img
        src={imageUrl}
        alt={title}
        className="w-20 h-20 object-cover rounded-md mr-4"
      />
      <div className="flex-1">
        <h3 className="font-bold text-lg">{title}</h3>
        {/* แสดง subtitle ที่นี่ */}
        <p className="text-sm text-steam-text-dark">{subtitle}</p>

        {/* แสดงสถานะคีย์เกม */}
        <div className={`text-sm ${statusColor} flex items-center mt-1`}>
          {statusIcon && <FontAwesomeIcon icon={statusIcon} className="mr-1" />}
          <span>{statusText}</span>
        </div>

        {gameKey &&
          keyStatus === "not-activated" && ( // แสดงคีย์จริงเมื่อยังไม่ได้เปิดใช้งาน
            <div className="flex items-center mt-2 text-sm text-steam-text-light bg-gray-700 p-2 rounded-md justify-between">
              <span className="font-mono text-xs overflow-hidden whitespace-nowrap text-ellipsis max-w-[calc(100%-40px)]">
                {gameKey}
              </span>
              <button
                onClick={handleCopyKey}
                className="ml-2 text-gray-400 hover:text-white"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
          )}
        {/* ส่วนของ friendsPlaying ถูกลบออกไปแล้ว */}
      </div>
      {actionButton}
    </div>
  );
};

export default RecentlyPlayedItem;
