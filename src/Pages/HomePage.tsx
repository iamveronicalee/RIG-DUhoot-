import { LinkIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import Layout from "../Component/Layout";

export default function HomePage() {
  return (
    <>
      <Layout key="" page={"Join a Quiz"}>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="max-w-7xl mx-auto ">
            {/* Replace with your content */}
            <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8">
                <div>
                  <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Join Quiz
                  </h2>
                </div>
                <form className="mt-8 space-y-6" action="#" method="POST">
                  <input type="hidden" name="remember" defaultValue="true" />
                  <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                      <label htmlFor="quiz-code" className="sr-only">
                        Quiz Code
                      </label>
                      <input
                        id="quiz-code"
                        name="quiz-code"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Enter Quiz Code"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <LinkIcon
                          className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                          aria-hidden="true"
                        />
                      </span>
                      Join
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>
      </Layout>
    </>
  );
}
