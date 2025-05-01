const sdrs_model = require('../models/sdrs_model');
const SDRS_Controller = {
    getFiles: async function (req, res) {
      try {
            const Data = await sdrs_model.getFiles();
            res.render("sdrs/SmartDrivingRecordSystem.ejs", {Data: Data});
            // res.send(`<pre>${JSON.stringify(Data, undefined, 2)}</pre>`);
        } catch (error) {
            res.status(500).send('Error retrieving files');
        }
    },
    checkFile: async function (req, res) {
      try {
            const Data = await sdrs_model.getFiles();
            res.send(Data);
        } catch (error) {
            res.status(500).send('Error retrieving files');
        }
    },
    delFile: async function (req, res) {
      try {
            const fileName = req.params["file"];
            console.log("delFile: " + fileName);
            const Data = await sdrs_model.delFile(fileName);
            // res.render("SmartDrivingRecordSystem.ejs", {Data: Data});
            res.send(`<pre>${JSON.stringify(Data, undefined, 2)}</pre>`);
        } catch (error) {
            res.status(500).send('Error retrieving files');
        }
    }
};

module.exports = SDRS_Controller;


var Data = { //假資料
  "d:multistatus": {
    "$": {
      "xmlns:d": "DAV:",
      "xmlns:s": "http://sabredav.org/ns",
      "xmlns:oc": "http://owncloud.org/ns",
      "xmlns:nc": "http://nextcloud.org/ns"
    },
    "d:response": [
      {
        "d:href": [
          "/remote.php/dav/files/team-fire/Videos/"
        ],
        "d:propstat": [
          {
            "d:prop": [
              {
                "d:getlastmodified": [
                  "Mon, 28 Apr 2025 07:52:15 GMT"
                ],
                "d:resourcetype": [
                  {
                    "d:collection": [
                      ""
                    ]
                  }
                ],
                "d:quota-used-bytes": [
                  "60174629"
                ],
                "d:quota-available-bytes": [
                  "-3"
                ],
                "d:getetag": [
                  "\"680f33af8a5d8\""
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 200 OK"
            ]
          }
        ]
      },
      {
        "d:href": [
          "/remote.php/dav/files/team-fire/Videos/video_20250423_160327.mp4"
        ],
        "d:propstat": [
          {
            "d:prop": [
              {
                "d:getlastmodified": [
                  "Wed, 23 Apr 2025 08:15:33 GMT"
                ],
                "d:getcontentlength": [
                  "15228123"
                ],
                "d:resourcetype": [
                  ""
                ],
                "d:getetag": [
                  "\"3ce32af4185a73f13bdb0af4dc128092\""
                ],
                "d:getcontenttype": [
                  "video/mp4"
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 200 OK"
            ]
          },
          {
            "d:prop": [
              {
                "d:quota-used-bytes": [
                  ""
                ],
                "d:quota-available-bytes": [
                  ""
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 404 Not Found"
            ]
          }
        ]
      },
      {
        "d:href": [
          "/remote.php/dav/files/team-fire/Videos/video_20250428_152211.mp4"
        ],
        "d:propstat": [
          {
            "d:prop": [
              {
                "d:getlastmodified": [
                  "Mon, 28 Apr 2025 07:22:21 GMT"
                ],
                "d:getcontentlength": [
                  "5869324"
                ],
                "d:resourcetype": [
                  ""
                ],
                "d:getetag": [
                  "\"c3c87553dff3a5014793ea42cb9262db\""
                ],
                "d:getcontenttype": [
                  "video/mp4"
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 200 OK"
            ]
          },
          {
            "d:prop": [
              {
                "d:quota-used-bytes": [
                  ""
                ],
                "d:quota-available-bytes": [
                  ""
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 404 Not Found"
            ]
          }
        ]
      },
      {
        "d:href": [
          "/remote.php/dav/files/team-fire/Videos/video_20250428_152220.mp4"
        ],
        "d:propstat": [
          {
            "d:prop": [
              {
                "d:getlastmodified": [
                  "Mon, 28 Apr 2025 07:22:28 GMT"
                ],
                "d:getcontentlength": [
                  "5554055"
                ],
                "d:resourcetype": [
                  ""
                ],
                "d:getetag": [
                  "\"3df2b7aec55ed5e669ebb0d447ac86e9\""
                ],
                "d:getcontenttype": [
                  "video/mp4"
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 200 OK"
            ]
          },
          {
            "d:prop": [
              {
                "d:quota-used-bytes": [
                  ""
                ],
                "d:quota-available-bytes": [
                  ""
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 404 Not Found"
            ]
          }
        ]
      },
      {
        "d:href": [
          "/remote.php/dav/files/team-fire/Videos/video_20250428_153741.mp4"
        ],
        "d:propstat": [
          {
            "d:prop": [
              {
                "d:getlastmodified": [
                  "Mon, 28 Apr 2025 07:37:51 GMT"
                ],
                "d:getcontentlength": [
                  "5398064"
                ],
                "d:resourcetype": [
                  ""
                ],
                "d:getetag": [
                  "\"ed651909ecf250fc6a5102e4693d14c7\""
                ],
                "d:getcontenttype": [
                  "video/mp4"
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 200 OK"
            ]
          },
          {
            "d:prop": [
              {
                "d:quota-used-bytes": [
                  ""
                ],
                "d:quota-available-bytes": [
                  ""
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 404 Not Found"
            ]
          }
        ]
      },
      {
        "d:href": [
          "/remote.php/dav/files/team-fire/Videos/video_20250428_153754.mp4"
        ],
        "d:propstat": [
          {
            "d:prop": [
              {
                "d:getlastmodified": [
                  "Mon, 28 Apr 2025 07:38:03 GMT"
                ],
                "d:getcontentlength": [
                  "5119692"
                ],
                "d:resourcetype": [
                  ""
                ],
                "d:getetag": [
                  "\"6a32098d1e94067fd877a84bd85ca487\""
                ],
                "d:getcontenttype": [
                  "video/mp4"
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 200 OK"
            ]
          },
          {
            "d:prop": [
              {
                "d:quota-used-bytes": [
                  ""
                ],
                "d:quota-available-bytes": [
                  ""
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 404 Not Found"
            ]
          }
        ]
      },
      {
        "d:href": [
          "/remote.php/dav/files/team-fire/Videos/video_20250428_153801.mp4"
        ],
        "d:propstat": [
          {
            "d:prop": [
              {
                "d:getlastmodified": [
                  "Mon, 28 Apr 2025 07:38:10 GMT"
                ],
                "d:getcontentlength": [
                  "5567010"
                ],
                "d:resourcetype": [
                  ""
                ],
                "d:getetag": [
                  "\"37ae32f68d1b71cd6622ee9fbd06ef60\""
                ],
                "d:getcontenttype": [
                  "video/mp4"
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 200 OK"
            ]
          },
          {
            "d:prop": [
              {
                "d:quota-used-bytes": [
                  ""
                ],
                "d:quota-available-bytes": [
                  ""
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 404 Not Found"
            ]
          }
        ]
      },
      {
        "d:href": [
          "/remote.php/dav/files/team-fire/Videos/video_20250428_155157.mp4"
        ],
        "d:propstat": [
          {
            "d:prop": [
              {
                "d:getlastmodified": [
                  "Mon, 28 Apr 2025 07:52:06 GMT"
                ],
                "d:getcontentlength": [
                  "5967217"
                ],
                "d:resourcetype": [
                  ""
                ],
                "d:getetag": [
                  "\"8dac0331b51651a406b993bc577d5fcd\""
                ],
                "d:getcontenttype": [
                  "video/mp4"
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 200 OK"
            ]
          },
          {
            "d:prop": [
              {
                "d:quota-used-bytes": [
                  ""
                ],
                "d:quota-available-bytes": [
                  ""
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 404 Not Found"
            ]
          }
        ]
      },
      {
        "d:href": [
          "/remote.php/dav/files/team-fire/Videos/video_20250428_155202.mp4"
        ],
        "d:propstat": [
          {
            "d:prop": [
              {
                "d:getlastmodified": [
                  "Mon, 28 Apr 2025 07:52:10 GMT"
                ],
                "d:getcontentlength": [
                  "5521029"
                ],
                "d:resourcetype": [
                  ""
                ],
                "d:getetag": [
                  "\"b6f849023782e1b5faffe4cb526bee40\""
                ],
                "d:getcontenttype": [
                  "video/mp4"
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 200 OK"
            ]
          },
          {
            "d:prop": [
              {
                "d:quota-used-bytes": [
                  ""
                ],
                "d:quota-available-bytes": [
                  ""
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 404 Not Found"
            ]
          }
        ]
      },
      {
        "d:href": [
          "/remote.php/dav/files/team-fire/Videos/video_20250428_155206.mp4"
        ],
        "d:propstat": [
          {
            "d:prop": [
              {
                "d:getlastmodified": [
                  "Mon, 28 Apr 2025 07:52:15 GMT"
                ],
                "d:getcontentlength": [
                  "5950115"
                ],
                "d:resourcetype": [
                  ""
                ],
                "d:getetag": [
                  "\"b380605f48a245523a978db6981bee6f\""
                ],
                "d:getcontenttype": [
                  "video/mp4"
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 200 OK"
            ]
          },
          {
            "d:prop": [
              {
                "d:quota-used-bytes": [
                  ""
                ],
                "d:quota-available-bytes": [
                  ""
                ]
              }
            ],
            "d:status": [
              "HTTP/1.1 404 Not Found"
            ]
          }
        ]
      }
    ]
  }
}