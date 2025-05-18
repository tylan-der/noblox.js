const http = require("../util/http.js").func;
const getGeneralToken = require("../util/getGeneralToken.js").func;

exports.required = ["userId"];
exports.optional = ["jar"];

// Docs
/**
 * 🔐 Start a conversation with another user.
 * @category Chat
 * @alias start121Conversation
 * @param {number} userId - The id of the user.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.start121Conversation(1)
 **/

const nextFunction = (jar, token, userId) => {
  return http({
    url: "//apis.roblox.com/platform-chat-api/v1/create-conversations",
    options: {
      method: "POST",
      jar,
      headers: {
        "X-CSRF-TOKEN": token,
      },
      json: {
        conversations: [
          {
            type: "one_to_one",
            participant_user_ids: [userId],
          },
        ],
        include_user_data: true,
      },
      resolveWithFullResponse: true,
    },
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === "Success") {
        throw new Error(res.body.statusMessage);
      }
    } else {
      throw new Error("Start conversation failed");
    }
  });
};

exports.func = (args) => {
  const jar = args.jar;

  return getGeneralToken({ jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.userId);
  });
};
