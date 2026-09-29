import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  const fetchPromise = uploadData
    ? fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      })
    : fetch(url);

  let res;
  try {
    res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
  } catch (error) {
    if (error.message.startsWith("Request took too long")) throw error;
    throw new Error("Network error. Please check your internet connection.");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  return data;
};
