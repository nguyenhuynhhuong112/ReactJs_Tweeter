export const sortComments = (tweets) => {
    return tweets.map((tweet) => ({
      ...tweet,
      comments: tweet.comments?.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    }));
  };
  
 export function formatTweetDate(dateTweet: any) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = new Date(dateTweet).toLocaleDateString(
      "vi-VN",
      options
    );
    return formattedDate.replace(/,/g, "");
  }


export  function formatDateJoin(dateTweet: any) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
    };
    const formattedDate = new Date(dateTweet).toLocaleDateString(
      "vi-VN",
      options
    );
    return formattedDate.replace(/,/g, "");
  }