// url的链接
export const urls = {
  //用户相关api
  login: "login",
  logout: "logout",
  register: "register",
  sendEmailCode: "sendEmailCode",
  githubLogin: "githubLogin",
  githubUserInfo: "githubUserInfo",
  qqLogin: "qqLogin",
  queryQqLoginUserInfo:"queryQqLoginUserInfo",
  updateUser:"updateUser",

  //评论相关api
  addComment: 'addComment',
  addThirdComment: 'addThirdComment',
  getCommentList: 'getCommentList',

  //文章相关api
  getArticleList: 'getArticleList',
  getHotArticleList: 'getHotArticleList',
  likeArticle: 'likeArticle',
  getArticleDetail: 'getArticleDetail',
  getAboutDetail: 'getAboutContent',

  //老版相关api
  addMessage: 'addMessage',
  getMessageList: 'getMessageList',
  getMessageDetail: 'getMessageDetail',

  //新版留言相关api
  addMessageBoard: 'addMessageBoard',
  getMessageBoardList: 'getMessageBoardList',

  //友链相关api
  getLinkList: 'getLinkList',
  getAllLinkList: 'getAllLinkList',
  
  //标签相关api
  getTagList: 'getTagList',
  getCategoryList: 'getCategoryList',

  //时间轴相关api
  getTimeAxisList: 'getTimeAxisList',
  getTimeAxisDetail: 'getTimeAxisDetail',

  //项目相关api
  getProjectList: 'getProjectList',
  getProjectDetail: 'getProjectDetail',
  
  //统计相关api
  addVisit: 'addVisit',
  getSiteData: 'getSiteData',

  //照片墙相关api
  getIndexBanner: 'getAlbumIdByName',
  getAlbum: 'getAlbumList',
};

export default urls;


