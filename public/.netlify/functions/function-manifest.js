// create metadata for all the available functions to pass to completions API
const tools = [
  {
    type: 'function',
    function: {
      name: 'transferCall',
      say: 'One moment while I transfer your call.',
      description: 'Transfers the customer to a live agent in case they request help from a real person.',
      parameters: {
        type: 'object',
        properties: {
          callSid: {
            type: 'string',
            description: 'The unique identifier for the active phone call.',
          },
        },
        required: ['callSid'],
      },
      returns: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Whether or not the customer call was successfully transfered'
          },
        }
      }
    },
  },
  // {
  //   type: 'function',
  //   function: {
  //     name: 'courseEnrollment',
  //     say: "Thanks for enrolling in this course. We have sent you an SMS with the further steps. Happy learning!",
  //     description: 'Called when the customer wants to enroll in the course.',
  //     parameters: {
  //       type: 'object',
  //       properties: {
  //         courseName: {
  //           type: 'string',
  //           description: 'Name of the course customer wants to enroll in.',
  //         },
  //       },
  //       required: ['courseName'],
  //     },
  //     returns: {
  //       type: 'object',
  //       properties: {
  //         status: {
  //           type: 'string',
  //           description: 'Whether or not the SMS was sent to the customer.'
  //         },
  //       }
  //     }
  //   },
  // },
];

module.exports = tools;