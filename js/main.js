const allPostContainer = document.getElementById("all-post-container");
const latestPostContainer = document.getElementById("latest-post-container");
const watchedContainer = document.getElementById("watched-container");
const readCountDiv = document.getElementById("read-count");
const allPostLoader = document.getElementById("all-post-loader");
const allPostError = document.getElementById("all-post-error");
const latestPostLoader = document.getElementById("latest-post-loader");
const latestPostError = document.getElementById("latest-post-error");
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-text");
let readCount = 0;
const getAllPost = (url) => {
  allPostLoader.classList.remove("hidden");
  allPostError.classList.add("hidden");
  allPostContainer.innerHTML = "";
  setTimeout(async () => {
    try {
      const res = await fetch(url);
      const { posts } = await res.json();
      allPostLoader.classList.add("hidden");
      if (!posts.length) {
        allPostError.innerText = "Post not found";
        allPostError.classList.remove("hidden");
        return;
      }
      posts.forEach((post) => {
        const {
          category: postCategory,
          author: { name: postAuthorName },
          title: postTitle,
          description: postDescription,
          comment_count: postCommentCount,
          view_count: postViewCount,
          posted_time: postPostedTime,
          image: postImageUrl,
          isActive,
        } = post;
        const div = document.createElement("div");
        div.innerHTML = `
        <div
          class="lg:p-10 p-4 bg-gray-100 border border-gray-400 rounded-3xl flex gap-3 lg:gap-6 hover:bg-green-100 hover:border-green-400 flex-col lg:flex-row items-center justify-center lg:items-start"
        >
          <div class="avatar relative">
            <div
                class="absolute w-4 h-4 bg-${
                  isActive ? "green" : "red"
                }-600 rounded-full -right-1 -top-1 border-2 border-white"
              ></div>
            <div class="lg:w-20 lg:h-20 w-16 h-16 rounded-2xl">
              <img
                 src="${postImageUrl}"
              />
            </div>
          </div>
          <div class="flex-1">
            <div class="font-semibold">
              <span># ${postCategory}</span>
              <span class="ms-3">Author : ${postAuthorName}</span>
            </div>
            <h3 class="lg:text-xl text-lg font-extrabold my-2">
              ${postTitle}
            </h3>
            <p class="mb-4">
              ${postDescription}
            </p>
            <div
              class="border-t-2 border-gray-300 border-dashed pt-2 flex justify-between items-center"
            >
              <div class="flex gap-4 text-lg">
                <span><i class="fa-solid fa-comment mr-1"></i> ${postCommentCount}</span>
                <span><i class="fa-solid fa-eye mr-1"></i> ${postViewCount}</span>
                <span><i class="fa-solid fa-clock mr-1"></i> ${postPostedTime} min</span>
              </div>
              <button
                 class="btn btn-sm bg-emerald-500 text-white aspect-square rounded-full" onclick="addToWatchList({postTitle: \`${postTitle}\`,  postViewCount: ${postViewCount}})"
              >
                <i class="fa-solid fa-envelope-open-text"></i>
              </button>
            </div>
          </div>
        </div>`;

        allPostContainer.appendChild(div);
      });
    } catch (error) {
      allPostError.innerText = error;
    }
  }, 2000);
};
getAllPost("https://openapi.programming-hero.com/api/retro-forum/posts");

const getLatestPost = (url) => {
  latestPostLoader.classList.remove("hidden");
  latestPostError.classList.add("hidden");
  latestPostContainer.innerHTML = "";
  setTimeout(async () => {
    try {
      const res = await fetch(url);
      const posts = await res.json();

      latestPostLoader.classList.add("hidden");
      if (!posts.length) {
        latestPostError.innerText = "Post not found";
        latestPostError.classList.remove("hidden");
        return;
      }
      posts.forEach((post) => {
        const {
          cover_image: postCoverImage,
          author: postAuthor,
          title: postTitle,
          description: postDescription,
          profile_image: profileImage,
        } = post;
        const div = document.createElement("div");
        div.innerHTML = `
          <div class="border border-gray-300 p-6 rounded-3xl hover:bg-green-100 hover:border-green-400">
            <img
              src="${postCoverImage}"
              alt="cover_image"
              class="w-full aspect-video rounded-2xl"
            />
            <div class="flex gap-2 items-center justify-start mt-4">
              <i class="fa-solid fa-calendar-days"></i>
              <span>${postAuthor?.["posted_date"] ?? "No publish date"}</span>
            </div>
            <h3 class="font-extrabold my-2">
              ${postTitle}
            </h3>
            <p class="text-gray-500">
             ${postDescription}
            </p>
            <div class="flex gap-4 items-center mt-4">
              <div class="avatar">
                <div class="w-12 rounded-full">
                  <img
                    src="${profileImage}"
                  />
                </div>
              </div>
              <div>
                <h4 class="font-bold">${postAuthor.name}</h4>
                <p class="text-gray-500">${
                  postAuthor?.designation ?? "Unknown"
                }</p>
              </div>
            </div>
          </div>`;

        latestPostContainer.appendChild(div);
      });
    } catch (error) {
      latestPostError.innerText = error;
    }
  }, 2000);
};

getLatestPost(
  "https://openapi.programming-hero.com/api/retro-forum/latest-posts"
);

const addToWatchList = ({ postTitle, postViewCount }) => {
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="bg-white rounded-2xl flex justify-between p-3 gap-3">
    <h3 class="font-bold">
      ${postTitle}
    </h3>
    <div class="flex gap-2 items-center">
      <i class="fa-solid fa-eye"></i>
      <span>${postViewCount}</span>
    </div>
  </div>`;

  watchedContainer.appendChild(div);
  readCountDiv.innerText = ++readCount;
};

searchBtn.addEventListener("click", () => {
  const searchText = searchInput.value;
  searchInput.value = "";
  getAllPost(
    searchText
      ? `https://openapi.programming-hero.com/api/retro-forum/posts?category=${searchText}`
      : "https://openapi.programming-hero.com/api/retro-forum/posts"
  );
  window.location.replace("#main");
});
