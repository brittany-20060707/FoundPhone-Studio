import { AudioPlayer, useTrack } from "../audio";
import { useSkinState } from "../skinState";
import {
  Bookmark,
  Check,
  Compass,
  Heart,
  Home,
  LockKeyhole,
  MessageCircle,
  Music,
  PlayCircle,
  Play,
  Plus,
  Search,
  SkipForward,
  User,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { safeMedia, type Item } from "../schema";
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
function TrackPlayer({
  item,
  p,
  onNext,
}: {
  item: Item;
  p: Props;
  onNext: () => void;
}) {
  return (
    <div className="track-player">
      <button onClick={() => p.onItem(item)}>
        <Music size={20} />
        <span>
          {item.title}
          <small>{item.sender}</small>
        </span>
      </button>
      {item.kind === "audio" && safeMedia(item.media) ? (
        <AudioPlayer p={p} item={item} />
      ) : (
        <button onClick={() => p.onItem(item)}>查看</button>
      )}
      <button aria-label="下一首" onClick={onNext}>
        <SkipForward size={19} />
      </button>
    </div>
  );
}
export function SpotifySkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [playlist, setPlaylist] = useState(""),
    [track, setTrack] = useTrack(p, items);
  const list = playlist
    ? items.filter((i) => (i.folder || "我的音乐") === playlist)
    : items;
  return (
    <div className="catalog-skin spotify-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <div className="spotify-heading">
          <Avatar name={p.owner ?? "我"} />
          <button
            className={tab === "首页" ? "selected" : ""}
            onClick={() => setTab("首页")}
          >
            音乐
          </button>
          <button
            className={tab === "音乐库" ? "selected" : ""}
            onClick={() => setTab("音乐库")}
          >
            音乐库
          </button>
        </div>
        {tab === "搜索" && <SearchBox value={q} set={setQ} />}
        <h1>{playlist || (tab === "音乐库" ? "音乐库" : "为你收藏")}</h1>
        {!playlist && (
          <div className="spotify-playlists">
            {groupItems(items, "我的音乐").map((g) => (
              <button key={g} onClick={() => setPlaylist(g)}>
                <Music size={29} />
                <strong>{g}</strong>
              </button>
            ))}
          </div>
        )}
        {playlist && (
          <button className="playlist-back" onClick={() => setPlaylist("")}>
            返回全部音乐
          </button>
        )}
        <div className="spotify-tracks">
          {list.map((i, n) => (
            <button
              key={i.id}
              onClick={() => {
                setTrack(i);
              }}
            >
              <span>{n + 1}</span>
              <div>
                <strong>{i.title}</strong>
                <small>
                  {i.sender} · {meta(i, "album")}
                </small>
              </div>
              <small>{meta(i, "duration")}</small>
            </button>
          ))}
        </div>
        <Empty items={list} />
      </div>
      {track && tab !== "私信" && (
        <TrackPlayer
          item={track}
          p={p}
          onNext={() =>
            setTrack(
              items[
                (items.findIndex((i) => i.id === track.id) + 1) % items.length
              ],
            )
          }
        />
      )}
      <Tabs
        tabs={["首页", "搜索", "音乐库"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setPlaylist("");
        }}
        icons={[<Home />, <Search />, <Music />]}
      />
    </div>
  );
}
export function NeteaseSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "发现");
  const [folder, setFolder] = useState(""),
    [track, setTrack] = useTrack(p, items);
  const [dmOpen, setDmOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const dmItems = items
    .filter((i) => meta(i, "neteaseType") === "direct-message")
    .sort((a, b) => a.time.localeCompare(b.time) || items.indexOf(a) - items.indexOf(b));
  const tracks = items.filter((i) => !dmItems.includes(i) && !["account", "peer", "peer-note", "discover-track"].includes(meta(i, "neteaseType")));
  const list = folder
    ? tracks.filter((i) => (i.folder || "我的歌单") === folder)
    : [];
  const account = items.find((i) => meta(i, "neteaseType") === "account");
  const accountName = account?.title ?? p.owner ?? "我的音乐";
  const accountAvatar = account?.avatar ?? "";
  const friendProfile = items.find((i) => meta(i, "neteaseType") === "peer");
  const friendName = friendProfile?.title ?? "好友";
  const friendAvatar = friendProfile?.avatar ?? "";
  const conversation = dmItems.filter((i) => meta(i, "peer") === friendName);
  const peerNotes = items.filter((i) => meta(i, "neteaseType") === "peer-note");
  const discoveryTracks = items.filter((i) => meta(i, "neteaseType") === "discover-track");
  return (
    <div className="catalog-skin netease-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        {tab === "私信" ? (
          profileOpen ? (
            <>
              <button className="netease-dm-back" onClick={() => setProfileOpen(false)}>‹ 返回私信</button>
              <section className="netease-peer-profile">
                <div className="netease-peer-profile-head"><Avatar name={friendName} src={friendAvatar} round /><div><h2>{friendName}</h2><small>网易云音乐用户</small></div></div>
                <div className="netease-peer-profile-stats"><span>关注 <b>1</b></span><span>粉丝 <b>1</b></span></div>
                <h3>笔记</h3>
                <div className="netease-peer-notes">{peerNotes.map((note) => { const songTitle = meta(note, "songTitle"); const noteText = songTitle ? note.body.replace(`《${songTitle}》`, "").trim() : note.body; const coverArt = meta(note, "coverArt"); return <article className="netease-peer-note" key={note.id}><time>{note.time}</time>{noteText && <p>{noteText}</p>}{songTitle && <div className="netease-song-share netease-note-song-share"><img className="netease-song-cover-art" src={coverArt} alt={`${songTitle}封面`} /><div className="netease-song-footer"><div className="netease-song-info"><strong>{songTitle}</strong><small><span>单曲</span> · {meta(note, "artist")}</small></div><PlayCircle className="netease-song-play" size={22} aria-label="单曲分享" /></div></div>}{meta(note, "comment") && <div className="netease-peer-comment"><Avatar name={accountName} src={accountAvatar} round /><div><strong>{accountName}</strong><p>{meta(note, "comment")}</p></div></div>}</article>; })}</div>
              </section>
            </>
          ) : dmOpen ? (
            <>
              <button className="netease-dm-back" onClick={() => setDmOpen(false)}>‹ 私信</button>
              <div className="netease-dm-heading"><button type="button" className="netease-avatar-link" aria-label="查看 Zqhhh 个人主页" onClick={() => setProfileOpen(true)}><Avatar name={friendName} src={friendAvatar} round /></button><strong>{friendName}</strong></div>
              <div className="netease-dm-thread">
                {conversation.map((message, index) => {
                  const previous = conversation[index - 1];
                  const showTime = !previous || previous.time !== message.time;
                  if (message.kind === "event") return <div className="netease-dm-event" key={message.id}>{showTime && <time>{message.time}</time>}<span>🎧 {message.body}</span><small>点击加入一起听</small></div>;
                  const isShare = meta(message, "songShare") === "true";
                  const matchedTitle = message.body.match(/《[^》]+》/)?.[0];
                  const songTitle = meta(message, "songTitle", matchedTitle ?? message.body.replace(/^分享(?:歌)?\s*/, ""));
                  const coverArt = meta(message, "coverArt");
                  const trailingText = isShare && matchedTitle ? message.body.replace(matchedTitle, "").replace(/^分享(?:歌)?\s*/, "").trim() : "";
                  const songKey = songTitle.includes("虚拟") ? "xuni" : songTitle.includes("找自己") ? "ziji" : songTitle.includes("打钉") ? "dading" : songTitle.toLowerCase().includes("after17") ? "after17" : songTitle.toLowerCase().includes("pain") ? "pain" : "music";
                  return <div className="netease-dm-row" key={message.id}>{showTime && <div className="netease-dm-time">{message.time}</div>}<div className={`netease-dm-message ${message.sender === accountName ? "mine" : "theirs"}`}>
                    {message.sender !== accountName && <button type="button" className="netease-avatar-link" aria-label="查看 Zqhhh 个人主页" onClick={() => setProfileOpen(true)}><Avatar name={friendName} src={friendAvatar} round /></button>}
                    <div>{isShare ? <><div className="netease-song-share">{coverArt ? <img className="netease-song-cover-art" src={coverArt} alt={`${songTitle}封面`} /> : <div className={`netease-song-cover cover-${songKey}`} aria-hidden="true"><Music size={22} /><span>♫</span></div>}<div className="netease-song-footer"><div className="netease-song-info"><strong>{songTitle}</strong><small><span>单曲</span> · {meta(message, "artist")}</small></div><PlayCircle className="netease-song-play" size={22} aria-label="单曲分享" /></div></div>{trailingText && <p>{trailingText}</p>}</> : <p>{message.body}</p>}</div>
                    {message.sender === accountName && <Avatar name={accountName} src={accountAvatar} round />}
                  </div></div>;
                })}
              </div>
            </>
          ) : (
            <>
              <h2 className="netease-dm-title">私信</h2>
              {dmItems.length ? <button className="netease-dm-contact" onClick={() => setDmOpen(true)}><Avatar name={friendName} src={friendAvatar} round /><span><strong>{friendName}</strong><small>{conversation.at(-1)?.body ?? ""}</small></span><time>{conversation.at(-1)?.time}</time></button> : <Empty items={[]} />}
            </>
          )
        ) : (
        <>
        {tab !== "发现" && <SearchBox value={q} set={setQ} />}
        {tab === "发现" ? (
          <>
            <div className="netease-discovery">
              <div className="netease-discovery-banner">
                <div><span>精选推荐</span><h2>欧美听歌时刻</h2><p>几首歌，陪你慢慢听</p></div>
                {discoveryTracks[0] && <img src={meta(discoveryTracks[0], "coverArt")} alt={`${discoveryTracks[0].title}专辑封面`} />}
              </div>
              <section className="netease-discovery-section">
                <div className="netease-discovery-heading"><h3>欧美推荐</h3><small>{discoveryTracks.length} 首单曲</small></div>
                <div className="netease-discovery-list">{discoveryTracks.map((song, index) => <article className="netease-discovery-track" key={song.id}><span className="netease-discovery-index">{String(index + 1).padStart(2, "0")}</span><img src={meta(song, "coverArt")} alt={`${song.title}专辑封面`} /><div><strong>{song.title}</strong><small>{meta(song, "artist")} · {meta(song, "album")}</small></div><span className="netease-discovery-label">单曲</span></article>)}</div>
              </section>
            </div>
          </>
        ) : (
          <>
            {folder ? (
              <>
                <button className="netease-playlist-back" onClick={() => setFolder("")}>‹ 我的歌单</button>
                <div className="netease-open-playlist-heading"><div className="netease-open-playlist-art">👻</div><div className="netease-open-playlist-copy"><h2>with 👻</h2><small>8 首单曲</small><span className="netease-private-label"><LockKeyhole size={12} />仅自己可见</span></div></div>
              </>
            ) : (
              <>
                <div className="netease-profile">
                  <Avatar name={accountName} src={accountAvatar} />
                  <h2>{accountName}</h2>
                  {account && <p className="netease-social-stats"><span>关注 <b>1</b> · {friendName}</span><span>粉丝 <b>1</b> · {friendName}</span></p>}
                </div>
                <h3 className="netease-playlist-title">我的歌单</h3>
                <div className="netease-my-playlist-grid">
                  <div className="netease-my-playlist" aria-label="我喜欢的音乐"><div className="netease-liked-art"><Heart size={28} fill="currentColor" strokeWidth={0} /></div><div><strong>我喜欢的音乐</strong><small>私人歌单</small></div></div>
                  <button type="button" className="netease-my-playlist is-open" onClick={() => setFolder("with 👻")}><div className="netease-with-ghost-art">👻</div><div className="netease-my-playlist-copy"><strong>with 👻</strong><small>8 首单曲</small><span className="netease-private-label"><LockKeyhole size={12} />仅自己可见</span></div></button>
                </div>
              </>
            )}
          </>
        )}
        {tab !== "发现" && folder !== "" && (<>{list.map((i, n) => (
          <div className="netease-track" key={i.id}>
            <button
              onClick={() => {
                setTrack(i);
              }}
            >
              <span>{n + 1}</span>
              <img className="netease-track-cover" src={meta(i, "coverArt")} alt={`${i.title}封面`} />
              <div className="netease-track-copy">
                <strong>{i.title}</strong><small>{meta(i, "artist", "未知歌手")}</small>
              </div>
            </button>
            <button
              aria-label={`歌曲详情${i.title}`}
              onClick={() => p.onItem(i)}
            >
              <MessageCircle size={18} />
            </button>
          </div>
        ))}
        <Empty items={list} /></>)}
      </>
      )}
      </div>
      {track && tab !== "发现" && (
        <TrackPlayer
          item={track}
          p={p}
          onNext={() =>
            setTrack(
              tracks[
                (tracks.findIndex((i) => i.id === track.id) + 1) % tracks.length
              ],
            )
          }
        />
      )}
      <Tabs
        tabs={["发现", "我的", "私信"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setFolder("");
        }}
        icons={[<Compass />, <Music />, <MessageCircle />]}
      />
    </div>
  );
}
export function YouTubeSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [category, setCategory] = useState("全部");
  const list = items.filter((i) =>
    tab === "Shorts"
      ? i.folder === "Shorts"
      : tab === "订阅"
        ? i.folder === "订阅"
        : tab === "播放列表"
          ? i.favorite || i.folder === "播放列表"
          : category === "全部" || i.folder === category,
  );
  return (
    <div className="catalog-skin youtube-ui">
      <Header p={p} />
      <SearchBox value={q} set={setQ} />
      <div className="youtube-chips">
        {["全部", ...groupItems(items).filter((g) => g !== "未分类")].map(
          (g) => (
            <button
              className={category === g ? "selected" : ""}
              key={g}
              onClick={() => setCategory(g)}
            >
              {g}
            </button>
          ),
        )}
      </div>
      <div className="catalog-scroll">
        <div className={tab === "Shorts" ? "youtube-shorts" : "youtube-videos"}>
          {list.map((i) => (
            <article key={i.id}>
              <button className="youtube-thumb" onClick={() => p.onItem(i)}>
                <Media item={i} />
                {meta(i, "duration") && <time>{meta(i, "duration")}</time>}
              </button>
              <button className="youtube-byline" onClick={() => p.onItem(i)}>
                <Avatar name={i.sender} />
                <div>
                  <strong>{i.title}</strong>
                  <small>
                    {i.sender} · {meta(i, "views", "—")} 次播放
                  </small>
                </div>
              </button>
            </article>
          ))}
        </div>
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "Shorts", "订阅", "播放列表"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Video />, <Users />, <User />]}
      />
    </div>
  );
}
export function BilibiliSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [category, setCategory] = useState("推荐");
  const list =
    tab === "历史"
      ? items.filter((i) => i.folder === "历史")
      : tab === "动态"
        ? items.filter((i) => i.folder === "动态")
        : category === "推荐"
          ? items
          : items.filter((i) => i.folder === category);
  return (
    <div className="catalog-skin bilibili-ui">
      <Header p={p} />
      <div className="bili-search">
        <Avatar name={p.owner ?? "我"} />
        <SearchBox value={q} set={setQ} />
      </div>
      <div className="bili-categories">
        {["推荐", "动画", "音乐", "生活"].map((c) => (
          <button
            key={c}
            className={category === c ? "selected" : ""}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="catalog-scroll">
        <div className="bili-grid">
          {list.map((i) => (
            <button key={i.id} onClick={() => p.onItem(i)}>
              <div>
                <Media item={i} />
                <small>
                  <Play size={10} />
                  {meta(i, "views", "—")}
                  <time>{meta(i, "duration")}</time>
                </small>
              </div>
              <strong>{i.title}</strong>
              <span>UP · {i.sender}</span>
            </button>
          ))}
        </div>
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "动态", "历史"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <MessageCircle />, <User />]}
      />
    </div>
  );
}
function VerticalVideo({ p, item }: { p: Props; item: Item }) {
  const [liked, setLiked] = useSkinState<boolean>(p, `liked-${item.id}`, false),
    [saved, setSaved] = useSkinState<boolean>(p, `saved-${item.id}`, false);
  return (
    <article className="vertical-video">
      <Media item={item} />
      <div className="vertical-actions">
        <button
          aria-label={`作者${item.sender}`}
          onClick={() => p.onItem(item)}
        >
          <Avatar name={item.sender} />
        </button>
        <button
          aria-label={`喜欢${item.title}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={29} fill={liked ? "#f44368" : "white"} />
          <small>{item.likes + (liked ? 1 : 0)}</small>
        </button>
        <button aria-label={`评论${item.title}`} onClick={() => p.onItem(item)}>
          <MessageCircle size={29} />
          <small>{item.comments.length}</small>
        </button>
        <button
          aria-label={`收藏${item.title}`}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark size={27} fill={saved ? "#f8cc55" : "none"} />
        </button>
      </div>
      <button className="vertical-caption" onClick={() => p.onItem(item)}>
        <strong>@{item.sender}</strong>
        <p>{item.body}</p>
        <small>
          <Music size={11} />
          {item.title}
        </small>
      </button>
    </article>
  );
}
export function DouyinSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "推荐");
  const list = tab === "推荐" ? items : items.filter((i) => i.folder === tab);
  return (
    <div className="catalog-skin douyin-ui">
      <Header p={p} />
      <div className="douyin-top">
        {["同城", "关注", "推荐"].map((t) => (
          <button
            className={tab === t ? "selected" : ""}
            key={t}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="vertical-feed">
        {list.map((i) => (
          <VerticalVideo key={i.id} p={p} item={i} />
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["推荐", "关注", "我"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Users />, <User />]}
      />
    </div>
  );
}
export function TikTokSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "For You");
  const list =
    tab === "For You"
      ? items
      : tab === "Following"
        ? items.filter((i) => i.folder === "关注" || i.folder === "Following")
        : items.filter((i) => i.folder === "个人主页");
  return (
    <div className="catalog-skin tiktok-ui">
      <Header p={p} />
      <div className="tiktok-top">
        <button
          className={tab === "Following" ? "selected" : ""}
          onClick={() => setTab("Following")}
        >
          Following
        </button>
        <button
          className={tab === "For You" ? "selected" : ""}
          onClick={() => setTab("For You")}
        >
          For You
        </button>
      </div>
      <div className="vertical-feed">
        {list.map((i) => (
          <VerticalVideo key={i.id} p={p} item={i} />
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["For You", "Following", "Profile"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Users />, <User />]}
      />
    </div>
  );
}
export function NetflixSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [saved, setSaved] = useSkinState<string[]>(p, "saved", []);
  const list =
    tab === "我的片单"
      ? items.filter((i) => i.favorite || saved.includes(i.id))
      : items;
  const featured = list[0];
  return (
    <div className="catalog-skin netflix-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {featured && tab === "首页" && (
          <div className="netflix-feature">
            <Media item={featured} />
            <div>
              <strong>{featured.title}</strong>
              <small>
                {meta(featured, "year")} · {meta(featured, "genre")} ·{" "}
                {meta(featured, "duration")}
              </small>
              <button onClick={() => p.onItem(featured)}>
                <Play size={16} />
                播放 / 详情
              </button>
              <button
                onClick={() =>
                  setSaved(
                    saved.includes(featured.id)
                      ? saved.filter((id) => id !== featured.id)
                      : [...saved, featured.id],
                  )
                }
              >
                {saved.includes(featured.id) ? (
                  <Check size={16} />
                ) : (
                  <Plus size={16} />
                )}
                我的片单
              </button>
            </div>
          </div>
        )}
        {groupItems(list, "影片").map((g) => (
          <section className="netflix-shelf" key={g}>
            <h3>{g}</h3>
            <div>
              {list
                .filter((i) => (i.folder || "影片") === g)
                .map((i) => (
                  <button key={i.id} onClick={() => p.onItem(i)}>
                    <Media item={i} />
                    <strong>{i.title}</strong>
                  </button>
                ))}
            </div>
          </section>
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "我的片单"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Bookmark />]}
      />
    </div>
  );
}










