<%@ WebHandler Language="C#" Class="ConfigureFileAttachment" %>

using System;
using System.Web;
using System.IO;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using System.Diagnostics;

public class ConfigureFileAttachment : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";

        try
        {
            if (context.Request["Path"] != null && context.Request.Files["fileTerms"] == null)
            {
                //for deleting existing File by file name
                string Serverpath = context.Request["Path"].ToString();

                string Savepath = context.Server.MapPath(Serverpath);
                if (File.Exists(Savepath))
                {
                    File.Delete(Savepath);
                }
            }
            else if (context.Request.Files["fileTerms"] != null || context.Request.Files["fileAnyOther"] != null || context.Request.Files["fileRFQAttach"] != null)
            {
                HttpPostedFile postedFileTerms = context.Request.Files["fileTerms"];
                string FolderFor = context.Request["AttachmentFor"];
                string CustomerName = context.Request["CustomerName"];
               

               // Debugger.Break();

                if (CustomerName != "")
                {
                    //  Debug.Write(BidID);
                    // Debug.Write(FolderFor);
                    string savepath = "";

                    string rootpath = @"C:\home\site\wwwroot\";
                    if (FolderFor == "Customer")
                    {
                        
                        savepath = rootpath + "\\"+CustomerName+ "\\assets\\";


                    }

                    string filenameTerms ="";
                   
                    if (postedFileTerms != null)
                    {
                        filenameTerms = postedFileTerms.FileName;
                    }
                   

                    if (!System.IO.Directory.Exists(savepath))
                        System.IO.Directory.CreateDirectory(savepath);


                  //  Regex re = new Regex("[|@|*|&|/|\\|,|+|$|~|%|'|\"|:|?|<|>|{|}|]|/g|#|]");
                   
                    

                    if (System.IO.File.Exists(savepath + @"\" + filenameTerms))
                    {
                        ResponseMsg r = new ResponseMsg
                        {
                            status = "success",
                            name = savepath
                        };
                        context.Response.Write(JsonConvert.SerializeObject(r));
                    }
                    else
                    {
                        ResponseMsg r = new ResponseMsg
                        {
                            status = "fail",
                            name = savepath
                        };
                        context.Response.Write(JsonConvert.SerializeObject(r));
                    }


                }

            }
        }
        catch (Exception ex)
        {
            context.Response.Write("Error: " + ex.Message);
        }
    }

    public class ResponseMsg
    {
        public string status;
        public string name;
    }
    public bool IsReusable {
        get {
            return false;
        }
    }

}