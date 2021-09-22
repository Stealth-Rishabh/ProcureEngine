<%@ WebHandler Language="C#"  Class="RFIVRFileAttachment" %>
using System;
using System.Web;
using System.IO;

public class RFIVRFileAttachment : IHttpHandler, System.Web.SessionState.IRequiresSessionState
{
    int mFileSize = 0;
    string  ftype="";
    public void ProcessRequest(HttpContext context)
    {
        try
        {

             if (context.Request.QueryString["Path"] != null )
            {
                //for deleting existing File by file name
                string Serverpath = context.Request.QueryString["Path"].ToString();
               
                string Savepath = context.Server.MapPath(Serverpath);
                if (File.Exists(Savepath))
                {
                    File.Delete(Savepath);
               }
            }
            else if (context.Request.QueryString["filepath"] != null && context.Request.QueryString["file"] != null)
            {
                //for downloading existing File
                string filepath = context.Request.QueryString["filepath"].ToString();
                string file = context.Request.QueryString["file"].ToString();

                if (File.Exists(filepath + "\\" + file))
                {
                    context.Response.Clear();
                    context.Response.ContentType = "application/octet-stream";
                    context.Response.AddHeader("Content-Disposition", string.Format("attachment; filename=\"{0}\"", file));
                    context.Response.WriteFile(filepath + "\\" + file);
                    context.Response.Flush();
                }

            }
            else
            {
                //for uploading new File
                string Serverpath = "PortalDocs";//System.Configuration.ConfigurationManager.AppSettings["FolderPath"];
                string Vals = context.Request.QueryString["Vals"].ToString();
                string FileBox = context.Request.QueryString["FileBox"].ToString();
                var postedFile = context.Request.Files[FileBox + Vals];
                string filesize = "15";
                mFileSize = postedFile.ContentLength / 1048576;
                ftype = postedFile.ContentType;


                if (mFileSize <= Convert.ToInt32(filesize))
                {
                    string FolderName = context.Request.QueryString["AttachmentFor"].ToString();
                    string RequirementID = context.Request.QueryString["RFXID"].ToString();
                    string RequirementHead = context.Request.QueryString["VendorID"].ToString();
                    
                    // Get Server Folder to upload file
                    
                        Serverpath = Serverpath + "\\" + FolderName + "\\" + RequirementID + "\\" + RequirementHead ;
                    
                   
                    string Savepath = context.Server.MapPath(Serverpath);
                    string file;

                    //For IE to get file name
                    if (HttpContext.Current.Request.Browser.Browser.ToUpper() == "IE")
                    {
                        string[] files = postedFile.FileName.Split(new char[] { '\\' });
                        file = files[files.Length - 1];

                    }
                    //For Other Browser to get file name
                    else
                    {
                        file = postedFile.FileName;
                    }

                    if (!Directory.Exists(Savepath))
                        Directory.CreateDirectory(Savepath);

                    string fileDirectory = Savepath + "\\" + file;
                    postedFile.SaveAs(fileDirectory);

                    //Set response message
                    //string msg = "{";
                    //msg += string.Format("error:'{0}',\n", string.Empty);
                    //msg += string.Format("upfile:'{0}'\n", file);
                    //msg += "}";
                    // context.Response.Write(msg);
                    context.Response.Write("File(s) Uploaded Successfully!");
                }
                else
                {
                    context.Response.Write("File(s) Exceeds Size");
                }
            }
         }
        catch (Exception ex)
        {
            //context.Response.Write("Error: " + ex.Message);
        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}