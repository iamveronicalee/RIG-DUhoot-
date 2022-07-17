import React from "react";
import ReactLoading from "react-loading";
import StellarBackground from "./StellarBackground";

export default function QuizScoreboard() {
  const users = [
    { username: "mav", score: 100 },
    { username: "niko", score: 100 },
  ];
  return (
    <div className="h-screen flex content-center justify-center overflow-hidden bg-indigo-900">
      <StellarBackground />
      <div className="flex flex-wrap flex-col content-center justify-center w-11/12 h-auto">
        <div className="animate-bounce my-6 mx-auto px-4 sm:px-6 md:px-8 inline-flex flex-col items-center justify-center">
          <h2 className="inline-flex items-center justify-center px-2.5 pt-5 content-center border border-transparent text-5xl font-medium rounded shadow-sm font-extrabold text-white italic w-full h-full drop-shadow-md lg:text-3xl md:text-5xl text-2xl text-center">
            You are In 1st position
          </h2>
        </div>
        <div className="flex flex-col w-full md:w-5/6">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Position
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                      >
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-blue-800 divide-y divide-blue-600">
                    {users.map((user) => (
                      <tr key={user.username}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {users.indexOf(user) + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {user.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
