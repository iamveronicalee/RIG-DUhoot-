import React, { useEffect, useState } from "react";
import StellarBackground from "./StellarBackground";
import { DotsVerticalIcon } from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function QuizHistoryComponent({ objectArr }) {
  const [userScoreList, setUserScoreList] = useState<any[]>([]);

  const loadData = () => {
    for (let i = 0; i < objectArr.length; i++) {
      let obj = {
        name: objectArr[i].participantConnection.userName,
        score: objectArr[i].score,
        bgColor: "bg-purple-600",
      };
      //   console.log('inner')
      setUserScoreList((userScoreList) => [...userScoreList, obj]);
    }
  };

  const clearContent = () => {
    let content = document.getElementById("list");
    if (content != null) {
      content.innerHTML = "";
    }
  };

  useEffect(() => {
    clearContent();
    loadData();
  }, [objectArr]);

  return (
    <>
      <div>
        <StellarBackground />
        <div className="relative">
          <ul
            id="list"
            className="mt-3 grid grid-cols-1 gap-1 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 p-8"
          >
            {userScoreList.map((project) => (
              <li
                //   key={project.name}
                className="col-span-1 flex shadow-sm rounded-md"
              >
                <div
                  className={classNames(
                    project.bgColor,
                    "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
                  )}
                >
                  {project.score}
                </div>
                <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                  <div className="flex-1 px-4 py-2 text-sm truncate">
                    <a
                      href={project.href}
                      className="text-gray-900 font-medium hover:text-gray-600"
                    >
                      {project.name}
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
