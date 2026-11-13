import { useSkinState } from "../skinState";
import {
  ArrowDown,
  ArrowUp,
  AtSign,
  Bookmark,
  Camera,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Grid,
  Hash,
  Heart,
  Home,
  MessageCircle,
  Repeat2,
  Search,
  User,
  Users,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import type { Item } from "../schema";
import {
  Avatar,
  Empty,
  groupItems,
  Header,
  Media,
  meta,
  SearchBox,
  Tabs,
  useContent,
  type Props,
} from "./shared";
function Actions({ p, item }: { p: Props; item: Item }) {
  const [liked, setLiked] = useSkinState<boolean>(p, `liked-${item.id}`, false),
    [saved, setSaved] = useSkinState<boolean>(p, `saved-${item.id}`, false);
  return (
    <div className="social-actions">
      <button aria-label={`喜欢${item.title}`} onClick={() => setLiked(!liked)}>
        <Heart size={17} fill={liked ? "currentColor" : "none"} />
        {item.likes + (liked ? 1 : 0) || ""}
      </button>
      <button aria-label={`评论${item.title}`} onClick={() => p.onItem(item)}>
        <MessageCircle size={17} />
        {item.comments.length || ""}
      </button>
      <button aria-label={`详情${item.title}`} onClick={() => p.onItem(item)}>
        <Repeat2 size={17} />
        {meta(item, "reposts")}
      </button>
      <button aria-label={`收藏${item.title}`} onClick={() => setSaved(!saved)}>
        <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
function PostHeader({ item, p }: { item: Item; p: Props }) {
  return (
    <button className="social-author" onClick={() => p.onItem(item)}>
      <Avatar name={item.sender} />
      <span>
        <strong>{item.sender}</strong>
        <small>{meta(item, "handle", item.time)}</small>
      </span>
    </button>
  );
}
function WeiboActions({ p, item }: { p: Props; item: Item }) {
  const [liked, setLiked] = useSkinState<boolean>(p, `liked-${item.id}`, false);
  return (
    <div className="social-actions weibo-actions">
      <button aria-label={`转发${item.title}`} onClick={() => p.onItem(item)}>
        <Share2 size={17} />
        {meta(item, "reposts", "转发")}
      </button>
      <button aria-label={`评论${item.title}`} onClick={() => p.onItem(item)}>
        <MessageCircle size={17} />
        {item.comments.length || "评论"}
      </button>
      <button
        aria-label={`喜欢${item.title}`}
        aria-pressed={liked}
        onClick={() => setLiked(!liked)}
      >
        <ThumbsUp size={17} fill={liked ? "currentColor" : "none"} />
        {item.likes + (liked ? 1 : 0) || "赞"}
      </button>
    </div>
  );
}
export function WeiboSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "关注");
  const [feed, setFeed] = useState("全部");
  const list = feed === "全部" ? items : items.filter((i) => i.folder === feed);
  return (
    <div className="catalog-skin weibo-ui">
      <Header p={p} />
      <div className="weibo-sections">
        {["关注", "发现", "我"].map((t) => (
          <button
            key={t}
            className={tab === t ? "selected" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="catalog-scroll">
        {tab === "我" ? (
          <div className="weibo-profile">
            <Avatar name={p.owner ?? "我"} />
            <h2>{p.owner ?? "我"}</h2>
            <span>{items.length} 条微博</span>
          </div>
        ) : (
          <>
            <SearchBox value={q} set={setQ} />
            <div className="weibo-feed-filter">
              {["全部", ...groupItems(items).filter((g) => g !== "未分类")].map(
                (g) => (
                  <button key={g} onClick={() => setFeed(g)}>
                    {g}
                  </button>
                ),
              )}
            </div>
          </>
        )}
        {list.map((i) => (
          <article className="weibo-post" key={i.id}>
            <PostHeader p={p} item={i} />
            <button className="social-body" onClick={() => p.onItem(i)}>
              <p>{i.body}</p>
              {i.media && <Media item={i} />}
            </button>
            <WeiboActions p={p} item={i} />
          </article>
        ))}
        <Empty items={list} />
      </div>
    </div>
  );
}
export function XSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "为你推荐");
  return (
    <div className="catalog-skin x-ui">
      <Header p={p} />
      <div className="x-feed-tabs">
        <button
          className={tab === "为你推荐" ? "selected" : ""}
          onClick={() => setTab("为你推荐")}
        >
          为你推荐
        </button>
        <button
          className={tab === "正在关注" ? "selected" : ""}
          onClick={() => setTab("正在关注")}
        >
          正在关注
        </button>
      </div>
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {items
          .filter((i) => tab === "为你推荐" || i.folder === "正在关注")
          .map((i) => (
            <article className="x-post" key={i.id}>
              <Avatar name={i.sender} />
              <div>
                <button className="x-byline" onClick={() => p.onItem(i)}>
                  <strong>{i.sender}</strong>
                  <span>
                    @{meta(i, "handle", i.sender)} · {i.time.slice(5, 10)}
                  </span>
                </button>
                <button className="social-body" onClick={() => p.onItem(i)}>
                  <p>{i.body}</p>
                  {i.media && <Media item={i} />}
                </button>
                <Actions p={p} item={i} />
              </div>
            </article>
          ))}
      </div>
      <Tabs
        tabs={["为你推荐", "正在关注"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Users />]}
      />
    </div>
  );
}
export function ThreadsSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "为你推荐");
  return (
    <div className="catalog-skin threads-ui">
      <Header p={p} />
      <div className="threads-title">
        <AtSign size={30} />
        <button
          onClick={() => setTab(tab === "为你推荐" ? "正在关注" : "为你推荐")}
        >
          {tab} ⌄
        </button>
      </div>
      <div className="catalog-scroll">
        {(tab === "个人主页"
          ? items
          : items.filter((i) => tab !== "正在关注" || i.folder === "正在关注")
        ).map((i) => (
          <article className="threads-post" key={i.id}>
            <div className="thread-avatar">
              <Avatar name={i.sender} />
              <i />
            </div>
            <div>
              <div className="threads-byline">
                <strong>{i.sender}</strong>
                <small>{i.time.slice(5, 10)}</small>
              </div>
              <button className="social-body" onClick={() => p.onItem(i)}>
                <p>{i.body}</p>
                {i.media && <Media item={i} />}
              </button>
              <Actions p={p} item={i} />
              <button className="thread-replies" onClick={() => p.onItem(i)}>
                {i.comments.length} 条回复
              </button>
            </div>
          </article>
        ))}
        <Empty items={items} />
      </div>
      <Tabs
        tabs={["为你推荐", "正在关注", "个人主页"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Users />, <User />]}
      />
    </div>
  );
}
export function FacebookSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "动态");
  const stories = items.filter((i) => i.folder === "Story");
  return (
    <div className="catalog-skin facebook-ui">
      <Header p={p} />
      <Tabs
        tabs={["动态", "好友", "个人主页"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Users />, <User />]}
      />
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {tab === "动态" ? (
          <>
            <button
              className="fb-compose"
              disabled={!p.creator}
              onClick={p.onAdd}
            >
              <Avatar name={p.owner ?? "我"} />
              分享新动态
            </button>
            <div className="fb-stories">
              {stories.map((i) => (
                <button key={i.id} onClick={() => p.onItem(i)}>
                  <Media item={i} />
                  <strong>{i.sender}</strong>
                </button>
              ))}
            </div>
            {items
              .filter((i) => i.folder !== "Story")
              .map((i) => (
                <article className="fb-post" key={i.id}>
                  <PostHeader p={p} item={i} />
                  <button className="social-body" onClick={() => p.onItem(i)}>
                    <p>{i.body}</p>
                    {i.media && <Media item={i} />}
                  </button>
                  <Actions p={p} item={i} />
                </article>
              ))}
          </>
        ) : tab === "好友" ? (
          <div className="fb-friends">
            {[...new Set(items.map((i) => i.sender))].map((s) => (
              <button
                key={s}
                onClick={() => p.onItem(items.find((i) => i.sender === s)!)}
              >
                <Avatar name={s} />
                <strong>{s}</strong>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="fb-cover" />
            <div className="fb-profile">
              <Avatar name={p.owner ?? "我"} />
              <h1>{p.owner ?? "我"}</h1>
            </div>
            {items
              .filter((i) => i.folder === "个人主页")
              .map((i) => (
                <button
                  key={i.id}
                  className="fb-profile-note"
                  onClick={() => p.onItem(i)}
                >
                  {i.title}
                  <p>{i.body}</p>
                </button>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
export function RedbookSkin(p: Props) {
  const { items } = useContent(p, "发现");
  const [page, setPage] = useState<"发现" | "我" | "搜索" | "消息" | "帖子详情">("发现");
  const [searchQuery, setSearchQuery] = useState("");
  const [historyVisible, setHistoryVisible] = useState(true);
  const [searchFrom, setSearchFrom] = useState<"发现" | "我">("发现");
  const openSearch = () => {
    setSearchFrom(page === "我" ? "我" : "发现");
    setPage("搜索");
  };
  const [profileTab, setProfileTab] = useState("收藏");
  const saved = items.filter((item) => item.folder === "收藏");
  const discover = items.filter((item) => item.folder === "发现").slice(0, 4);
  const avatar = <span className="redbook-avatar" aria-hidden="true">m</span>;
  const recentSearches = [
    "两只猫第一次见面怎么相处",
    "张函瑞17岁应援",
    "好吃的低热量零食",
    "近期流行设计师品牌",
    "卧室编曲监听耳机推荐",
    "怎么区分是对自己要求太高还是别人真的在否定自己",
    "秋冬季节香水合集",
    "胡琴445进行曲",
  ];
  const guessSearches = [
    "青蛙玩偶",
    "韩国新款小众包包",
    "叠穿公式",
    "原住民和新猫怎么磨合",
    "书单推荐",
    "固体500卡和液体500卡有区别吗",
  ];
  const commentThreads = [
    { author: "Xin", text: "csh 到底咋进的一班", replies: [
      ["R.（我）", "实力"],
      ["路人A", "硬塞的吧 反正记得刚上楼那会被骂惨了"],
      ["天使小比格", "陈春会趴你耳边说的🤣但凡有眼睛的人都知道他是靠实力进的  成团的爱豆不看实力看啥  没实力的上台了表演站桩吗你不是专业的就不要去点评人家  先去补作业吧"],
      ["路人B", "实力"],
    ]},
    { author: "ella", text: "二班感情看着比一班好，一班感觉都是小团体，硬凑在一起的", replies: [
      ["R.", "有小团体不代表关系不好。尊重个性和差异不也是体现大家包容度和友善的方式吗，大家私下吵架都是没两天就会和好的朋友，一班和其他代的相处模式可能确实不一样，但是没有必要说感情不好吧。"],
    ]},
    { author: "10%", text: "一直eat不到这个张桂源", replies: [
      ["路人F", "一直eat不到这个张桂源"],
      ["路人E", "一直eat不到这个张桂源"],
      ["R.", "一直eat这个张桂源"],
      ["10%", "？", "回复 R.（我）"],
    ]},
    { author: "momo", text: "cyh到底是好是坏啊😬我有点想粉上了", replies: [
      ["R.", "他本人性格非常好的 那时候在试训期还不算是，然后刚从英国回来也不懂    当时心还是很小的时候被诱导了 ，他是非常单纯善良的孩子。"],
      ["路人C", "和ss有接触是真的，但是存在ss恶意引导造谣吧"],
    ]},
    { author: "555", text: "看物料 感觉一班有几位挺精的", replies: [
      ["xuxu", "都有谁啊"],
      ["Queen", "他们在竞争诶  为了热度卖也是不是坏事啊  人家知道要抓热度往上爬啊"],
    ]},
    { author: "念念", text: "居然有人觉得zhr是皇子吗", replies: [
      ["用户10086", "感觉纯血上楼一路遭受各种不公平待遇吧，公司捧谁也很明显，他唱歌实力完全是断层级别啊但是一直被压着"],
      ["0707", "纳尼？"],
    ]},
  ];

  if (page === "消息") {
    return (
      <div className="catalog-skin redbook-ui redbook-messages-ui">
        <header className="redbook-simple-header">
          <button aria-label="返回首页" onClick={() => setPage("发现")}><ChevronLeft size={24} /></button>
          <strong>消息</strong><span />
        </header>
        <button className="redbook-like-notification" onClick={() => setPage("帖子详情")}>
          <span className="redbook-notification-icon"><Heart size={22} fill="currentColor" /></span>
          <span className="redbook-notification-copy">
            <strong>赞和评论<i className="redbook-unread-dot" /></strong>
            <small>有几人赞了你的评论</small>
            <em>🍐🍑四代敢说贴</em>
          </span>
          <ChevronRight size={18} />
        </button>
      </div>
    );
  }

  if (page === "帖子详情") {
    return (
      <div className="catalog-skin redbook-ui redbook-thread-ui">
        <header className="redbook-simple-header">
          <button aria-label="返回消息" onClick={() => setPage("消息")}><ChevronLeft size={24} /></button>
          <strong>笔记详情</strong><span />
        </header>
        <main className="redbook-thread-scroll">
          <div className="redbook-thread-author">{avatar}<strong>momo</strong><button>关注</button></div>
          <h2>🍐🍑四代敢说贴</h2>
          <p className="redbook-thread-intro">大家有什么想说的可以说出来 <span>#tf四代</span></p>
          <div className="redbook-thread-cover"><span>四代敢说贴</span></div>
          <div className="redbook-thread-stats">评论 {commentThreads.length} · 赞和收藏</div>
          <div className="redbook-thread-comments">
            {commentThreads.map((thread, index) => (
              <section className="redbook-comment-thread" key={thread.author + index}>
                <div className="redbook-comment-main">
                  <span className="redbook-comment-avatar">{thread.author.slice(0, 1)}</span>
                  <div><strong>⭐️ {thread.author}</strong><p>{thread.text}</p><small>回复</small></div>
                </div>
                <div className="redbook-comment-replies">
                  {thread.replies.map(([name, text, to], replyIndex) => (
                    <div className="redbook-comment-reply" key={name + replyIndex}>
                      <strong>{name}</strong>{to && <small> 回复 {to}</small>}：{text}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (page === "搜索") {
    return (
      <div className="catalog-skin redbook-ui redbook-search-ui">
        <header className="redbook-search-header">
          <button aria-label="返回" onClick={() => setPage(searchFrom)}>
            <ChevronLeft size={25} />
          </button>
          <form
            className="redbook-search-field"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <input
              aria-label="搜索内容"
              placeholder="搜索你感兴趣的内容"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <button type="button" aria-label="拍照搜索"><Camera size={21} /></button>
            <i />
            <button className="redbook-search-submit" type="submit">搜索</button>
          </form>
        </header>
        <main className="redbook-search-content">
          <section className="redbook-search-history">
            <div className="redbook-search-section-title">
              <strong>历史记录</strong>
              <button aria-label="清空搜索记录" onClick={() => setHistoryVisible(false)}>
                <Trash2 size={19} />
              </button>
            </div>
            <div className="redbook-search-chips">
              {historyVisible && recentSearches.map((term) => (
                <button key={term} onClick={() => setSearchQuery(term)}>{term}</button>
              ))}
            </div>
          </section>
          <section className="redbook-search-guesses">
            <div className="redbook-search-section-title">
              <strong>猜你想搜</strong>
              <button aria-label="换一换"><span>···</span></button>
            </div>
            <div className="redbook-search-guess-grid">
              {guessSearches.map((term) => (
                <button key={term} onClick={() => setSearchQuery(term)}>{term}</button>
              ))}
            </div>
          </section>
        </main>
        <div className="redbook-search-keyboard" aria-hidden="true">
          <div className="redbook-search-voice">按住提问 有问必答 ✨<span>🎙</span></div>
          <div className="redbook-keyboard-row">{["q","w","e","r","t","y","u","i","o","p"].map((key) => <i key={key}>{key}</i>)}</div>
          <div className="redbook-keyboard-row inset">{["a","s","d","f","g","h","j","k","l"].map((key) => <i key={key}>{key}</i>)}</div>
          <div className="redbook-keyboard-row">{["⇧","z","x","c","v","b","n","m","⌫"].map((key) => <i key={key}>{key}</i>)}</div>
          <div className="redbook-keyboard-row bottom">
            <i>123</i><i>☺</i><i className="space" /><i className="search-key">⌕</i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="catalog-skin redbook-ui">
      {page === "发现" ? (
        <>
          <header className="redbook-discover-header">
            <button className="redbook-header-icon" aria-label="消息">
              <MessageCircle size={22} />
            </button>
            <nav className="redbook-discover-tabs" aria-label="发现分类">
              <button>关注</button>
              <button className="selected">发现</button>
              <button>重庆</button>
            </nav>
            <button className="redbook-header-icon" aria-label="搜索" onClick={openSearch}>
              <Search size={22} />
            </button>
          </header>
          <section className="redbook-discover-grid" aria-label="发现内容">
            {discover.map((item) => (
              <article className="redbook-discover-card" key={item.id}>
                <Media item={item} className="redbook-post-image" />
                <strong>{item.title}</strong>
                <div className="redbook-post-byline">
                  {avatar}
                  <span>momo</span>
                  <span className="redbook-like-count">
                    <Heart size={14} />
                    {item.likes}
                  </span>
                </div>
              </article>
            ))}
          </section>
          <nav className="redbook-bottom-nav" aria-label="小红书导航">
            <button className="active" onClick={() => setPage("发现")}>
              <Home size={20} /><span>首页</span>
            </button>
            <button aria-label="市集">
              <Grid size={20} /><span>市集</span>
            </button>
            <button className="redbook-create" aria-label="发布" disabled>＋</button>
            <button aria-label="消息" onClick={() => setPage("消息")}>
              <MessageCircle size={20} /><span>消息</span>
            </button>
            <button onClick={() => setPage("我")}>
              <User size={20} /><span>我</span>
            </button>
          </nav>
        </>
      ) : (
        <>
          <header className="redbook-profile-banner">
            <div className="redbook-profile-toolbar">
              <button aria-label="菜单">☰</button>
              <span>
                <button aria-label="扫一扫"><Grid size={21} /></button>
                <button aria-label="分享"><Share2 size={22} /></button>
              </span>
            </div>
            <div className="redbook-profile-person">
              {avatar}
              <strong>R.</strong>
            </div>
          </header>
          <section className="redbook-profile-panel">
            <nav className="redbook-profile-tabs" aria-label="个人内容">
              {["笔记", "🔒 评论", "🔒 收藏", "🔒 赞过"].map((label) => {
                const value = label.replace("🔒 ", "");
                return (
                  <button
                    key={label}
                    className={profileTab === value ? "selected" : ""}
                    onClick={() => setProfileTab(value)}
                  >
                    {label}
                  </button>
                );
              })}
              <button aria-label="搜索" onClick={openSearch}><Search size={20} /></button>
            </nav>
            <div className="redbook-profile-categories">
              <strong>笔记 1989</strong><span>专辑 4</span><span>合集 2</span>
              <span>评论 3</span><span>话题 15</span><span>地点 28</span>
            </div>
            <div className="redbook-profile-saved-scroll">
              {profileTab === "收藏" ? (
                <div className="redbook-saved-grid">
                  {saved.map((item) => (
                    <button
                      className="redbook-saved-card"
                      key={item.id}
                      onClick={() => p.onItem(item)}
                    >
                      <Media item={item} className="redbook-post-image" />
                      <strong>{item.title}</strong>
                      <div className="redbook-post-byline">
                        {avatar}<span>momo</span>
                        <span className="redbook-like-count">
                          <Heart size={14} />{item.likes}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="redbook-profile-empty">暂无内容</div>
              )}
            </div>
          </section>
          <nav className="redbook-bottom-nav" aria-label="小红书导航">
            <button onClick={() => setPage("发现")}>
              <Home size={20} /><span>首页</span>
            </button>
            <button aria-label="市集">
              <Grid size={20} /><span>市集</span>
            </button>
            <button className="redbook-create" aria-label="发布" disabled>＋</button>
            <button aria-label="消息" onClick={() => setPage("消息")}>
              <MessageCircle size={20} /><span>消息</span><i className="redbook-unread-dot" />
            </button>
            <button className="active" onClick={() => setPage("我")}>
              <User size={20} /><span>我</span>
            </button>
          </nav>
        </>
      )}
    </div>
  );
}
export function PinterestSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "发现");
  const [board, setBoard] = useState("");
  const list = board
    ? items.filter((i) => (i.folder || "未分类") === board)
    : items;
  return (
    <div className="catalog-skin pinterest-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        {tab === "收藏板" && !board ? (
          <>
            <h1>收藏板</h1>
            <div className="pinterest-boards">
              {groupItems(items).map((g) => (
                <button key={g} onClick={() => setBoard(g)}>
                  <Media
                    item={items.find((i) => (i.folder || "未分类") === g)!}
                  />
                  <strong>{g}</strong>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <SearchBox value={q} set={setQ} />
            {board && (
              <button
                className="pinterest-board-title"
                onClick={() => setBoard("")}
              >
                {board} · 返回收藏板
              </button>
            )}
            <div className="pinterest-pins">
              {list.map((i) => (
                <button key={i.id} onClick={() => p.onItem(i)}>
                  <Media item={i} />
                  <strong>{i.title}</strong>
                </button>
              ))}
            </div>
            <Empty items={list} />
          </>
        )}
      </div>
      <Tabs
        tabs={["发现", "收藏板"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setBoard("");
        }}
        icons={[<Home />, <Grid />]}
      />
    </div>
  );
}
export function RedditSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [sort, setSort] = useState("最新");
  const list = [...items].sort((a, b) =>
    sort === "热门" ? b.likes - a.likes : b.time.localeCompare(a.time),
  );
  return (
    <div className="catalog-skin reddit-ui">
      <Header p={p} />
      <div className="reddit-community">
        <Hash size={21} />
        <button onClick={() => setTab(tab === "首页" ? "社区" : "首页")}>
          {tab} ⌄
        </button>
        <select
          aria-label="帖子排序"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option>最新</option>
          <option>热门</option>
        </select>
      </div>
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {tab === "社区"
          ? groupItems(items).map((g) => (
              <button
                className="reddit-sub"
                key={g}
                onClick={() => {
                  setQ(g === "未分类" ? "" : g);
                  setTab("首页");
                }}
              >
                <Hash size={22} />
                {g}
                <small>
                  {items.filter((i) => (i.folder || "未分类") === g).length} 帖
                </small>
              </button>
            ))
          : list.map((i) => <RedditPost key={i.id} p={p} item={i} />)}
        <Empty items={items} />
      </div>
      <Tabs
        tabs={["首页", "社区"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Users />]}
      />
    </div>
  );
}
function RedditPost({ p, item: i }: { p: Props; item: Item }) {
  const [vote, setVote] = useSkinState<number>(p, `vote-${i.id}`, 0);
  return (
    <article className="reddit-post">
      <button className="reddit-byline" onClick={() => p.onItem(i)}>
        r/{meta(i, "community", i.folder || "story")} · u/{i.sender}
      </button>
      <button className="social-body" onClick={() => p.onItem(i)}>
        <h3>{i.title}</h3>
        <p>{i.body}</p>
        {i.media && <Media item={i} />}
      </button>
      <div className="reddit-actions">
        <button
          aria-label={`赞同${i.title}`}
          onClick={() => setVote(vote === 1 ? 0 : 1)}
        >
          <ArrowUp size={17} />
        </button>
        <span>{Number(meta(i, "votes", String(i.likes))) + vote}</span>
        <button
          aria-label={`反对${i.title}`}
          onClick={() => setVote(vote === -1 ? 0 : -1)}
        >
          <ArrowDown size={17} />
        </button>
        <button onClick={() => p.onItem(i)}>
          <MessageCircle size={16} />
          {i.comments.length} 评论
        </button>
      </div>
    </article>
  );
}
export function ForumSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "帖子");
  const [board, setBoard] = useState("");
  const list = board
    ? items.filter((i) => (i.folder || "未分类") === board)
    : items;
  return (
    <div className="catalog-skin forum-ui">
      <Header p={p} />
      <div className="forum-banner">
        <Hash size={27} />
        <strong>{board || "论坛"}</strong>
        <span>{items.length} 个主题</span>
      </div>
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {tab === "版块"
          ? groupItems(items).map((g) => (
              <button
                className="forum-board"
                key={g}
                onClick={() => {
                  setBoard(g);
                  setTab("帖子");
                }}
              >
                <FolderIcon />
                <div>
                  <strong>{g}</strong>
                  <small>
                    {items.filter((i) => (i.folder || "未分类") === g).length}{" "}
                    个主题
                  </small>
                </div>
                <ChevronRight size={16} />
              </button>
            ))
          : list.map((i) => (
              <button
                className="forum-topic"
                key={i.id}
                onClick={() => p.onItem(i)}
              >
                <strong>
                  {meta(i, "status") && <em>{meta(i, "status")}</em>}
                  {i.title}
                </strong>
                <p>{i.body.split("\n")[0]}</p>
                <div>
                  <span>
                    {i.sender} · {i.time.slice(5, 16)}
                  </span>
                  <span>
                    {meta(i, "views", "—")} 浏览 · {i.comments.length} 回复
                  </span>
                </div>
              </button>
            ))}
      </div>
      <Tabs
        tabs={["帖子", "版块"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setBoard("");
        }}
        icons={[<MessageCircle />, <Grid />]}
      />
    </div>
  );
}
function FolderIcon() {
  return <Hash size={27} />;
}
export function SnapchatSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "快拍");
  const [index, setIndex] = useState(0);
  const list = items.filter((i) =>
    tab === "回忆"
      ? i.favorite || i.folder === "回忆"
      : tab === "聊天"
        ? i.folder === "聊天"
        : i.folder !== "聊天",
  );
  const i = list[index % Math.max(list.length, 1)];
  return (
    <div className="catalog-skin snapchat-ui">
      <Header p={p} />
      <div className="snap-content">
        {tab === "聊天" ? (
          <div className="snap-chats">
            {list.map((x) => (
              <button key={x.id} onClick={() => p.onItem(x)}>
                <Avatar name={x.sender} />
                <div>
                  <strong>{x.sender}</strong>
                  <small>{x.body}</small>
                </div>
                <Camera size={20} />
              </button>
            ))}
          </div>
        ) : i ? (
          <>
            <Media item={i} />
            <button className="snap-author" onClick={() => p.onItem(i)}>
              <Avatar name={i.sender} />
              {i.sender}
            </button>
            <button
              className="snap-next"
              aria-label="下一条快拍"
              onClick={() => {
                setIndex((n) => n + 1);
                p.onRead(i.id);
              }}
            >
              <ChevronRight size={25} />
            </button>
            <button className="snap-caption" onClick={() => p.onItem(i)}>
              {i.body}
            </button>
          </>
        ) : (
          <p className="catalog-empty">暂无{tab}</p>
        )}
      </div>
      <Tabs
        tabs={["聊天", "快拍", "回忆"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setIndex(0);
        }}
        icons={[<MessageCircle />, <Camera />, <ImageIcon />]}
      />
    </div>
  );
}
function ImageIcon() {
  return <Grid />;
}
