<%@ WebHandler Language="C#" Class="ConfigureFileAttachment" %>

using System;
using System.Web;
using System.IO;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
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
                HttpPostedFile postedFileAnyOther = context.Request.Files["fileAnyOther"];
                HttpPostedFile postedeRFQFile = context.Request.Files["fileRFQAttach"];
                string FolderFor = context.Request["AttachmentFor"];
                string BidID = context.Request["BidID"];
                string VendorID = context.Request["VendorID"];
                string Version = context.Request["Version"];



                if (BidID != "0")
                {
                    
                    string savepath = "";
                    //string tempPath = "";
                    //string rootpath=@"C:\PEV1SC\SourcingPortal\";
                    string rootpath = @"C:\home\site\wwwroot\";
                         Console.Write(FolderFor);
                         Console.Write(rootpath);
                    if (FolderFor == "Customer")
                    {
                        //savepath = rootpath + "\\"+BidID+ "\\assets\\";
                        savepath = BidID+ "\\assets\\";
                    }
                    //else
                    //{
                    //    savepath = context.Server.MapPath(tempPath) + "\\PortalDocs\\" + "\\" + FolderFor + "\\" + BidID + "\\" + VendorID+"\\" + Version;
                    //}

                    string filenameTerms ="";
                    string filenameAnyOther = ""; // = postedFileAnyOther.FileName;
                    string filenameRFQAttach = "";
                    if (postedFileTerms != null)
                    {
                        filenameTerms = postedFileTerms.FileName;
                    }
                    if (postedFileAnyOther != null)
                    // if (context.Request.Files["fileAnyOther"].FileName != null)
                    {
                        filenameAnyOther = postedFileAnyOther.FileName;
                    }
                    if (postedeRFQFile != null)
                    {
                        filenameRFQAttach = postedeRFQFile.FileName;
                    }

                    if (!System.IO.Directory.Exists(savepath))
                        System.IO.Directory.CreateDirectory(savepath);

                    //Regex re = new Regex("[;\\/:*?\"<>|&']");
                    Regex re = new Regex("[|@|*|&|/|\\|,|+|$|~|%|'|\"|:|?|<|>|{|}|]|/g|#|]");
                    if (filenameTerms != null && filenameTerms!="")
                    {
                        filenameTerms= re.Replace(filenameTerms, "_");
                        postedFileTerms.SaveAs(savepath + @"\" + filenameTerms);
                    }
                    if (postedFileAnyOther != null)
                    {
                        filenameAnyOther= re.Replace(filenameAnyOther, "_");
                        postedFileAnyOther.SaveAs(savepath + @"\" + filenameAnyOther);
                    }
                    if (postedeRFQFile != null)
                    {
                        filenameRFQAttach = re.Replace(filenameRFQAttach, "_");
                        postedeRFQFile.SaveAs(savepath + @"\" + filenameRFQAttach);
                    }
                    //context.Response.StatusCode = 200;

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

                //HttpPostedFile postedFile = context.Request.Files["file"];
                //string BidID = context.Request["BidID"];
                //if (BidID !="0")
                //{
                //    string savepath = "";
                //    string tempPath = "";
                //    savepath = context.Server.MapPath(tempPath) + "/TermsConditions/" + BidID;
                //    string filename = postedFile.FileName;
                //    if (!System.IO.Directory.Exists(savepath))
                //        System.IO.Directory.CreateDirectory(savepath);

                //    postedFile.SaveAs(savepath + @"\" + filename);
                //    context.Response.StatusCode = 200;
                //}
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