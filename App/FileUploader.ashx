<%@ WebHandler Language="C#" Class="FileUploader" %>

using System;
using System.Web;

public class FileUploader : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        context.Response.Expires = -1;
        try
        
       {
            HttpPostedFile postedFile = context.Request.Files["file"];
            string BidID = context.Request["BidID"];
            string VendorID = context.Request["VendorID"];
            if(VendorID!="0")
            {
                string savepath = "";
                string tempPath = "";
                savepath = context.Server.MapPath(tempPath) + "/VendorRegDoc/" + VendorID;
                string filename = postedFile.FileName;
                if (!System.IO.Directory.Exists(savepath))
                    System.IO.Directory.CreateDirectory(savepath);

                postedFile.SaveAs(savepath + @"\" + filename);
                context.Response.StatusCode = 200;
            }
            if (BidID !="0")
            {
                string savepath = "";
                string tempPath = "";
                savepath = context.Server.MapPath(tempPath) + "/BidDoc/" + BidID;
                string filename = postedFile.FileName;
                if (!System.IO.Directory.Exists(savepath))
                    System.IO.Directory.CreateDirectory(savepath);

                postedFile.SaveAs(savepath + @"\" + filename);
                context.Response.StatusCode = 200;
            }
        }
        catch (Exception ex)
        {
            context.Response.Write("Error: " + ex.Message);
        }
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}