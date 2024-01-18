import { tweetsData } from './data.js';
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


loadLocalStorage()

document.addEventListener("click",function(e){
    if(e.target.dataset.likes){
        handleLikes(e.target.dataset.likes)
    }else if(e.target.dataset.retweets){
        handleRetweets(e.target.dataset.retweets)
    }else if(e.target.dataset.replies){
        handleReplies(e.target.dataset.replies)
    }else if(e.target.id==='tweet-btn'){
        tweet()
    }
})

function handleLikes(tweetUid){
    const thisTweet=tweetsData.filter(function(tweet){
        return tweet.uuid===tweetUid
    })[0]
    if(thisTweet.isLiked){
        thisTweet.likes--
    }else{
        thisTweet.likes++
    }
    thisTweet.isLiked=!thisTweet.isLiked
    render()
    saveToLocalStorage()
}

function handleRetweets(tweetUid){
    const thisTweet=tweetsData.filter(function(tweet){
        return tweet.uuid===tweetUid
    })[0]
    if(thisTweet.isRetweeted){
        thisTweet.retweets--
    }else{
        thisTweet.retweets++
    }
    thisTweet.isRetweeted=!thisTweet.isRetweeted
    render()
    saveToLocalStorage()
}

function handleReplies(tweetUid){
document.getElementById(`replies-${tweetUid}`).classList.toggle("hidden")

}

function tweet(){
    const tweetInput= document.getElementById("tweet-input")
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Ali-scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        render()
        saveToLocalStorage()
    }
    tweetInput.value=""
}

function saveToLocalStorage(){
    localStorage.setItem("tweetsdata",JSON.stringify(tweetsData))
}
function loadLocalStorage(){
        let savedTweetsData = JSON.parse(localStorage.getItem("tweetsdata"));
        if (savedTweetsData) {
            // Update the values within the constant
            tweetsData.length = 0; // Clear the existing array
            tweetsData.push(...savedTweetsData); // Push the new items
        }
}
    


function getFeedHtml(){
    let feedHtml=``
    tweetsData.forEach(function(tweet){
        let repliesHtml=``
        let likeClass=""
        let retweetClass=""
        if(tweet.isLiked){
            likeClass="liked"
        }
        if(tweet.isRetweeted){
            retweetClass="retweeted"
        }

        tweet.replies.forEach(function(reply){
            repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>`
        })


        feedHtml+=`
                    <div class="tweet">
                        <div class="tweet-inner">
                            <img src="${tweet.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${tweet.handle}</p>
                                <p class="tweet-text">${tweet.tweetText}</p>
                                <div class="tweet-details">
                                    <span class="tweet-detail">
                                        <i class="fa-regular fa-comment-dots" data-replies="${tweet.uuid}"></i>
                                        ${tweet.replies.length}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-heart ${likeClass}" data-likes="${tweet.uuid}"></i>
                                        ${tweet.likes}
                                    </span>
                                    <span class="tweet-detail">
                                        <i class="fa-solid fa-retweet ${retweetClass}" data-retweets="${tweet.uuid}"></i>
                                        ${tweet.retweets}
                                    </span>
                                </div>   
                            </div>            
                        </div>
                    <div class="hidden" id="replies-${tweet.uuid}">
                            ${repliesHtml}
                    </div> 
                    </div>
                    `
    })
    return feedHtml
}

function render(){
    document.getElementById("feed").innerHTML=getFeedHtml()
}

render()

