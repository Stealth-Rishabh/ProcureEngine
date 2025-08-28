$(document).ready(function(){
    recentblog()
});

const  recentblog=()=>{
    const casePosts = [
        
        { date: "14 June", href: "https://www.procurengine.com/Increasing-the-market-reach-for-commodity-selling-thro’-innovative-auction-on-a-win-win.html", title: "Increasing the market reach for commodity selling thro’ innovative auction on a win-win" },
        { date: "30th June", href: "https://procurengine.com/to-maximize-the-monetization-of-export-scrip.html", title: "To maximize the monetization of Export scrip" },
        { date: "8th  July", href: "https://procurengine.com/can-you-use-saas-platforms-and-integrate-it-to-their-multiple-legacy-erp-systems.html", title: " Can you use SaaS platforms and integrate it to their multiple legacy ERP systems?" },
           // Add more blog post objects as needed
    ];
    const $caseList = $('#caseList');
    $.each(casePosts, function(index, post) {
        var listItem = '<li><span class="date">' + post.date + '</span><a href="' + post.href + '">' + post.title + '</a></li>';
        $caseList.append(listItem);
    });
    
}