// ============================================
// 网站数据配置 — 所有内容集中在此文件
// 修改这里即可更新全站内容，无需改组件代码
// ============================================

export const siteConfig = {
  name: "冻梨摄影",
  tagline: "杭州·绍兴独立摄影师",
  description: "冻梨摄影（Dlidex）杭州·绍兴独立摄影师，专业设备与氛围道具，为你记录婚姻登记与幸福瞬间。",
  contact: {
    wechat: "dlidex1024",
    xiaohongshu: "@赛博冻梨dlidex",
    email: "skynettiantian@gmail.com",
    phone: "",
  },
  social: {
    xiaohongshu: "https://xhslink.com/m/53NEq3yUrfq",
    weibo: "",
    instagram: "",
  },
};

// 作品分类 — 按拍摄业务分类
export const portfolioCategories = [
  { id: "领证跟拍", label: "领证跟拍" },
  { id: "订婚跟拍", label: "订婚跟拍" },
  { id: "婚礼跟拍", label: "婚礼跟拍" },
  { id: "宝宝宴", label: "宝宝宴" },
  { id: "各类写真", label: "各类写真" },
] as const;

export type PortfolioCategoryId = (typeof portfolioCategories)[number]["id"];

// 作品数据 — 由「dlidex摄影网站客片同步」技能自动生成（sync_datats.py）。
// 手动修改此段会在下次同步时被覆盖；width/height 为压缩后真实比例。
export interface PortfolioItem {
  id: string;
  title: string;
  category: Exclude<PortfolioCategoryId, "all">;
  src: string;
  width: number;
  height: number;
  /** 占位图（尚无真实客片）：不进入画廊展示，避免灰块破坏观感 */
  placeholder?: boolean;
  /** 所属相册（婚礼跟拍等大类下的二级分组，由 IMA 子文件夹名决定） */
  album?: string;
}

export const portfolioItems: PortfolioItem[] = [
  { id: "c-783511c8bd", title: "领证跟拍 · c-783511c8bd", category: "领证跟拍", album: "5", src: "/photo/photos/c-783511c8bd.webp", width: 1067, height: 1600 },
  { id: "c-bd702bf929", title: "领证跟拍 · c-bd702bf929", category: "领证跟拍", album: "5", src: "/photo/photos/c-bd702bf929.webp", width: 1067, height: 1600 },
  { id: "c-3bac82b77f", title: "领证跟拍 · c-3bac82b77f", category: "领证跟拍", album: "5", src: "/photo/photos/c-3bac82b77f.webp", width: 1067, height: 1600 },
  { id: "c-722bb9cf7c", title: "领证跟拍 · c-722bb9cf7c", category: "领证跟拍", album: "5", src: "/photo/photos/c-722bb9cf7c.webp", width: 1067, height: 1600 },
  { id: "c-778f9055b8", title: "领证跟拍 · c-778f9055b8", category: "领证跟拍", album: "5", src: "/photo/photos/c-778f9055b8.webp", width: 1067, height: 1600 },
  { id: "c-90993b0862", title: "领证跟拍 · c-90993b0862", category: "领证跟拍", album: "4", src: "/photo/photos/c-90993b0862.webp", width: 1135, height: 1600 },
  { id: "c-c53955ea3a", title: "领证跟拍 · c-c53955ea3a", category: "领证跟拍", album: "4", src: "/photo/photos/c-c53955ea3a.webp", width: 1200, height: 1600 },
  { id: "c-2a38fcfa13", title: "领证跟拍 · c-2a38fcfa13", category: "领证跟拍", album: "4", src: "/photo/photos/c-2a38fcfa13.webp", width: 1200, height: 1600 },
  { id: "c-b55f39457c", title: "领证跟拍 · c-b55f39457c", category: "领证跟拍", album: "其他", src: "/photo/photos/c-b55f39457c.webp", width: 1023, height: 1537 },
  { id: "c-f59bbf91ef", title: "领证跟拍 · c-f59bbf91ef", category: "领证跟拍", album: "其他", src: "/photo/photos/c-f59bbf91ef.webp", width: 1023, height: 1537 },
  { id: "c-db4d83486e", title: "领证跟拍 · c-db4d83486e", category: "领证跟拍", album: "其他", src: "/photo/photos/c-db4d83486e.webp", width: 1023, height: 1537 },
  { id: "c-bbed48cd26", title: "领证跟拍 · c-bbed48cd26", category: "领证跟拍", album: "其他", src: "/photo/photos/c-bbed48cd26.webp", width: 1025, height: 1535 },
  { id: "c-ae75c4e651", title: "领证跟拍 · c-ae75c4e651", category: "领证跟拍", album: "客片1", src: "/photo/photos/c-ae75c4e651.webp", width: 1067, height: 1600 },
  { id: "c-f816cc5f5c", title: "领证跟拍 · c-f816cc5f5c", category: "领证跟拍", album: "客片1", src: "/photo/photos/c-f816cc5f5c.webp", width: 1067, height: 1600 },
  { id: "c-0a84b72aee", title: "领证跟拍 · c-0a84b72aee", category: "领证跟拍", album: "客片1", src: "/photo/photos/c-0a84b72aee.webp", width: 1033, height: 1600 },
  { id: "c-34af14950f", title: "领证跟拍 · c-34af14950f", category: "领证跟拍", album: "客片1", src: "/photo/photos/c-34af14950f.webp", width: 1067, height: 1600 },
  { id: "c-588351f377", title: "领证跟拍 · c-588351f377", category: "领证跟拍", album: "客片1", src: "/photo/photos/c-588351f377.webp", width: 1067, height: 1600 },
  { id: "c-67b5eeaebc", title: "领证跟拍 · c-67b5eeaebc", category: "领证跟拍", album: "客片3", src: "/photo/photos/c-67b5eeaebc.webp", width: 1067, height: 1600 },
  { id: "c-12221d1395", title: "领证跟拍 · c-12221d1395", category: "领证跟拍", album: "客片2", src: "/photo/photos/c-12221d1395.webp", width: 1067, height: 1600 },
  { id: "c-2f87e2ed4f", title: "领证跟拍 · c-2f87e2ed4f", category: "领证跟拍", album: "客片2", src: "/photo/photos/c-2f87e2ed4f.webp", width: 1067, height: 1600 },
  { id: "c-6e82c5b7fc", title: "领证跟拍 · c-6e82c5b7fc", category: "领证跟拍", album: "客片2", src: "/photo/photos/c-6e82c5b7fc.webp", width: 1023, height: 1537 },
  { id: "d1-1", title: "订婚跟拍 · d1-1", category: "订婚跟拍", src: "/photo/photos/d1-1.webp", width: 1067, height: 1600 },
  { id: "d1-2", title: "订婚跟拍 · d1-2", category: "订婚跟拍", src: "/photo/photos/d1-2.webp", width: 1600, height: 1246 },
  { id: "d1-3", title: "订婚跟拍 · d1-3", category: "订婚跟拍", src: "/photo/photos/d1-3.webp", width: 1067, height: 1600 },
  { id: "d1-4", title: "订婚跟拍 · d1-4", category: "订婚跟拍", src: "/photo/photos/d1-4.webp", width: 1067, height: 1600 },
  { id: "d1-5", title: "订婚跟拍 · d1-5", category: "订婚跟拍", src: "/photo/photos/d1-5.webp", width: 1067, height: 1600 },
  { id: "d1-6", title: "订婚跟拍 · d1-6", category: "订婚跟拍", src: "/photo/photos/d1-6.webp", width: 1067, height: 1600 },
  { id: "d1-7", title: "订婚跟拍 · d1-7", category: "订婚跟拍", src: "/photo/photos/d1-7.webp", width: 1067, height: 1600 },
  { id: "d1-8", title: "订婚跟拍 · d1-8", category: "订婚跟拍", src: "/photo/photos/d1-8.webp", width: 1067, height: 1600 },
  { id: "d1-9", title: "订婚跟拍 · d1-9", category: "订婚跟拍", src: "/photo/photos/d1-9.webp", width: 1067, height: 1600 },
  { id: "d2-1", title: "订婚跟拍 · d2-1", category: "订婚跟拍", src: "/photo/photos/d2-1.webp", width: 1067, height: 1600 },
  { id: "d2-2", title: "订婚跟拍 · d2-2", category: "订婚跟拍", src: "/photo/photos/d2-2.webp", width: 1067, height: 1600 },
  { id: "d2-3", title: "订婚跟拍 · d2-3", category: "订婚跟拍", src: "/photo/photos/d2-3.webp", width: 1067, height: 1600 },
  { id: "d2-4", title: "订婚跟拍 · d2-4", category: "订婚跟拍", src: "/photo/photos/d2-4.webp", width: 1068, height: 1600 },
  { id: "d2-5", title: "订婚跟拍 · d2-5", category: "订婚跟拍", src: "/photo/photos/d2-5.webp", width: 1068, height: 1600 },
  { id: "d2-6", title: "订婚跟拍 · d2-6", category: "订婚跟拍", src: "/photo/photos/d2-6.webp", width: 1067, height: 1600 },
  { id: "d2-7", title: "订婚跟拍 · d2-7", category: "订婚跟拍", src: "/photo/photos/d2-7.webp", width: 1067, height: 1600 },
  { id: "w-0867d7f022", title: "婚礼跟拍 · w-0867d7f022", category: "婚礼跟拍", album: "妆造", src: "/photo/photos/w-0867d7f022.webp", width: 1067, height: 1600 },
  { id: "w-edc2b4b02c", title: "婚礼跟拍 · w-edc2b4b02c", category: "婚礼跟拍", album: "妆造", src: "/photo/photos/w-edc2b4b02c.webp", width: 1067, height: 1600 },
  { id: "w-62a4e8f649", title: "婚礼跟拍 · w-62a4e8f649", category: "婚礼跟拍", album: "妆造", src: "/photo/photos/w-62a4e8f649.webp", width: 1067, height: 1600 },
  { id: "w-ec1c457e25", title: "婚礼跟拍 · w-ec1c457e25", category: "婚礼跟拍", album: "妆造", src: "/photo/photos/w-ec1c457e25.webp", width: 1600, height: 1067 },
  { id: "w-4fb8ff8b1f", title: "婚礼跟拍 · w-4fb8ff8b1f", category: "婚礼跟拍", album: "妆造", src: "/photo/photos/w-4fb8ff8b1f.webp", width: 1600, height: 1067 },
  { id: "w-4b9cf85175", title: "婚礼跟拍 · w-4b9cf85175", category: "婚礼跟拍", album: "妆造", src: "/photo/photos/w-4b9cf85175.webp", width: 1600, height: 1067 },
  { id: "w-a2608270ea", title: "婚礼跟拍 · w-a2608270ea", category: "婚礼跟拍", album: "妆造", src: "/photo/photos/w-a2608270ea.webp", width: 1600, height: 1066 },
  { id: "w-3a1a86e946", title: "婚礼跟拍 · w-3a1a86e946", category: "婚礼跟拍", album: "合影", src: "/photo/photos/w-3a1a86e946.webp", width: 1600, height: 1067 },
  { id: "w-86dd235da4", title: "婚礼跟拍 · w-86dd235da4", category: "婚礼跟拍", album: "合影", src: "/photo/photos/w-86dd235da4.webp", width: 1600, height: 1067 },
  { id: "w-06743ecd35", title: "婚礼跟拍 · w-06743ecd35", category: "婚礼跟拍", album: "合影", src: "/photo/photos/w-06743ecd35.webp", width: 1600, height: 1067 },
  { id: "w-4bf3ec3a41", title: "婚礼跟拍 · w-4bf3ec3a41", category: "婚礼跟拍", album: "合影", src: "/photo/photos/w-4bf3ec3a41.webp", width: 1600, height: 1067 },
  { id: "w-7ab1ed64b0", title: "婚礼跟拍 · w-7ab1ed64b0", category: "婚礼跟拍", album: "合影", src: "/photo/photos/w-7ab1ed64b0.webp", width: 1600, height: 1067 },
  { id: "w-508c8e6807", title: "婚礼跟拍 · w-508c8e6807", category: "婚礼跟拍", album: "敬酒", src: "/photo/photos/w-508c8e6807.webp", width: 1600, height: 1067 },
  { id: "w-e781db9279", title: "婚礼跟拍 · w-e781db9279", category: "婚礼跟拍", album: "敬酒", src: "/photo/photos/w-e781db9279.webp", width: 1600, height: 1067 },
  { id: "w-1ec69483d4", title: "婚礼跟拍 · w-1ec69483d4", category: "婚礼跟拍", album: "敬酒", src: "/photo/photos/w-1ec69483d4.webp", width: 1600, height: 1067 },
  { id: "w-ddc3d934ca", title: "婚礼跟拍 · w-ddc3d934ca", category: "婚礼跟拍", album: "仪式", src: "/photo/photos/w-ddc3d934ca.webp", width: 1600, height: 1067 },
  { id: "w-7650cd21db", title: "婚礼跟拍 · w-7650cd21db", category: "婚礼跟拍", album: "仪式", src: "/photo/photos/w-7650cd21db.webp", width: 1600, height: 1067 },
  { id: "w-64238b0b06", title: "婚礼跟拍 · w-64238b0b06", category: "婚礼跟拍", album: "仪式", src: "/photo/photos/w-64238b0b06.webp", width: 1600, height: 1067 },
  { id: "w-b0e748b641", title: "婚礼跟拍 · w-b0e748b641", category: "婚礼跟拍", album: "仪式", src: "/photo/photos/w-b0e748b641.webp", width: 1600, height: 1067 },
  { id: "w-7de536fe5f", title: "婚礼跟拍 · w-7de536fe5f", category: "婚礼跟拍", album: "仪式", src: "/photo/photos/w-7de536fe5f.webp", width: 1600, height: 1067 },
  { id: "w-d1f6192d01", title: "婚礼跟拍 · w-d1f6192d01", category: "婚礼跟拍", album: "仪式", src: "/photo/photos/w-d1f6192d01.webp", width: 1600, height: 1067 },
  { id: "w-c66b4e0eb2", title: "婚礼跟拍 · w-c66b4e0eb2", category: "婚礼跟拍", album: "仪式", src: "/photo/photos/w-c66b4e0eb2.webp", width: 1600, height: 1067 },
  { id: "w-fe18f5bf12", title: "婚礼跟拍 · w-fe18f5bf12", category: "婚礼跟拍", album: "迎亲", src: "/photo/photos/w-fe18f5bf12.webp", width: 1600, height: 1066 },
  { id: "w-8108c54e30", title: "婚礼跟拍 · w-8108c54e30", category: "婚礼跟拍", album: "迎亲", src: "/photo/photos/w-8108c54e30.webp", width: 1600, height: 1067 },
  { id: "w-4bcf01a326", title: "婚礼跟拍 · w-4bcf01a326", category: "婚礼跟拍", album: "迎亲", src: "/photo/photos/w-4bcf01a326.webp", width: 1600, height: 1067 },
  { id: "w-3c42d2d710", title: "婚礼跟拍 · w-3c42d2d710", category: "婚礼跟拍", album: "迎亲", src: "/photo/photos/w-3c42d2d710.webp", width: 1600, height: 1067 },
  { id: "w-a2a55cd9ea", title: "婚礼跟拍 · w-a2a55cd9ea", category: "婚礼跟拍", album: "迎亲", src: "/photo/photos/w-a2a55cd9ea.webp", width: 1600, height: 1067 },
  { id: "b1-1", title: "宝宝宴 · b1-1", category: "宝宝宴", src: "/photo/photos/b1-1.webp", width: 1536, height: 1024 },
  { id: "b1-2", title: "宝宝宴 · b1-2", category: "宝宝宴", src: "/photo/photos/b1-2.webp", width: 1023, height: 1537 },
  { id: "b1-3", title: "宝宝宴 · b1-3", category: "宝宝宴", src: "/photo/photos/b1-3.webp", width: 1023, height: 1537 },
  { id: "b1-4", title: "宝宝宴 · b1-4", category: "宝宝宴", src: "/photo/photos/b1-4.webp", width: 1537, height: 1023 },
  { id: "b1-5", title: "宝宝宴 · b1-5", category: "宝宝宴", src: "/photo/photos/b1-5.webp", width: 1536, height: 1024 },
  { id: "x-7beee3ee41", title: "各类写真 · x-7beee3ee41", category: "各类写真", src: "/photo/photos/x-7beee3ee41.webp", width: 1067, height: 1600 },
  { id: "x-c8bb3dd634", title: "各类写真 · x-c8bb3dd634", category: "各类写真", src: "/photo/photos/x-c8bb3dd634.webp", width: 1600, height: 1067 },
  { id: "x-2167bfd586", title: "各类写真 · x-2167bfd586", category: "各类写真", src: "/photo/photos/x-2167bfd586.webp", width: 1067, height: 1600 },
  { id: "x-210eaa23e5", title: "各类写真 · x-210eaa23e5", category: "各类写真", src: "/photo/photos/x-210eaa23e5.webp", width: 1067, height: 1600 },
  { id: "x-f384e085c5", title: "各类写真 · x-f384e085c5", category: "各类写真", src: "/photo/photos/x-f384e085c5.webp", width: 1067, height: 1600 },
  { id: "x-473bfee660", title: "各类写真 · x-473bfee660", category: "各类写真", src: "/photo/photos/x-473bfee660.webp", width: 1067, height: 1600 },
  { id: "x-db170ae36d", title: "各类写真 · x-db170ae36d", category: "各类写真", src: "/photo/photos/x-db170ae36d.webp", width: 1067, height: 1600 },
  { id: "x-fa6e0c4c84", title: "各类写真 · x-fa6e0c4c84", category: "各类写真", src: "/photo/photos/x-fa6e0c4c84.webp", width: 1067, height: 1600 },
  { id: "x-da3e8fec31", title: "各类写真 · x-da3e8fec31", category: "各类写真", src: "/photo/photos/x-da3e8fec31.webp", width: 1067, height: 1600 },
  { id: "x-7ed50229d0", title: "各类写真 · x-7ed50229d0", category: "各类写真", src: "/photo/photos/x-7ed50229d0.webp", width: 1067, height: 1600 },
  { id: "x-a3aef65028", title: "各类写真 · x-a3aef65028", category: "各类写真", src: "/photo/photos/x-a3aef65028.webp", width: 1067, height: 1600 },
  { id: "x-24a1f29ee7", title: "各类写真 · x-24a1f29ee7", category: "各类写真", src: "/photo/photos/x-24a1f29ee7.webp", width: 1067, height: 1600 },
  { id: "x-93c9c0404a", title: "各类写真 · x-93c9c0404a", category: "各类写真", src: "/photo/photos/x-93c9c0404a.webp", width: 1067, height: 1600 },
  { id: "x-082598ecb1", title: "各类写真 · x-082598ecb1", category: "各类写真", src: "/photo/photos/x-082598ecb1.webp", width: 1067, height: 1600 },
  { id: "x-c7c783ed7f", title: "各类写真 · x-c7c783ed7f", category: "各类写真", src: "/photo/photos/x-c7c783ed7f.webp", width: 1067, height: 1600 },
  { id: "x-891e2693ce", title: "各类写真 · x-891e2693ce", category: "各类写真", src: "/photo/photos/x-891e2693ce.webp", width: 1067, height: 1600 },
  { id: "x-d05585bd40", title: "各类写真 · x-d05585bd40", category: "各类写真", src: "/photo/photos/x-d05585bd40.webp", width: 1067, height: 1600 },
  { id: "x-90af184938", title: "各类写真 · x-90af184938", category: "各类写真", src: "/photo/photos/x-90af184938.webp", width: 1067, height: 1600 },
  { id: "x-839f82f2c1", title: "各类写真 · x-839f82f2c1", category: "各类写真", src: "/photo/photos/x-839f82f2c1.webp", width: 1051, height: 1600 },
  { id: "x-285021a5f0", title: "各类写真 · x-285021a5f0", category: "各类写真", src: "/photo/photos/x-285021a5f0.webp", width: 1067, height: 1600 },
];

export const featuredPortfolioIds = ["c-783511c8bd", "d1-1", "w-0867d7f022", "b1-1"];

// 相册分组（婚礼跟拍等大类的二级导航）。由「dlidex摄影网站客片同步」技能自动生成（sync_datats.py）。
// 手动修改此段会在下次同步时被覆盖；album 的 id/name 取自 IMA 子文件夹名。
export interface AlbumDef {
  id: string;
  name: string;
  category: PortfolioCategoryId;
}
export const portfolioAlbums: AlbumDef[] = [
  { id: "5", name: "5", category: "领证跟拍" },
  { id: "4", name: "4", category: "领证跟拍" },
  { id: "其他", name: "其他", category: "领证跟拍" },
  { id: "客片1", name: "客片1", category: "领证跟拍" },
  { id: "客片3", name: "客片3", category: "领证跟拍" },
  { id: "客片2", name: "客片2", category: "领证跟拍" },
  { id: "妆造", name: "妆造", category: "婚礼跟拍" },
  { id: "迎亲", name: "迎亲", category: "婚礼跟拍" },
  { id: "仪式", name: "仪式", category: "婚礼跟拍" },
  { id: "敬酒", name: "敬酒", category: "婚礼跟拍" },
  { id: "合影", name: "合影", category: "婚礼跟拍" },
];

// 服务套餐
export interface ServicePackage {
  id: string;
  name: string;
  price: string;
  deposit: string;
  description: string;
  features: string[];
  location: string;
  popular?: boolean;
}

export const servicePackages: ServicePackage[] = [
  {
    id: "basic",
    name: "套餐一",
    price: "¥299",
    deposit: "定金 ¥150",
    description: "民政局内景快速出片，适合注重效率、喜欢简约记录的新人",
    features: [
      "拍摄时间 60–90 分钟",
      "底片不少于 60 张，全部赠送",
      "精修 6 张",
      "当晚给底片，精修当晚或第二天交付",
      "尾款当天拍摄完成后结清",
    ],
    location: "拍摄内容：民政局内部",
  },
  {
    id: "standard",
    name: "套餐二",
    price: "¥399",
    deposit: "定金 ¥200",
    description: "民政局 + 外景 + 车景，记录完整领证仪式感，最受欢迎",
    features: [
      "拍摄时间不少于 2 小时",
      "底片不少于 100 张，全部赠送",
      "精修 9 张",
      "当晚或第二天出精修",
      "尾款当天拍摄完成后结清",
    ],
    location: "拍摄内容：民政局 + 外景 + 车景",
    popular: true,
  },
  {
    id: "commercial",
    name: "其他拍摄",
    price: "面议",
    deposit: "定金协商",
    description: "各类写真、订婚跟拍、求婚记录、轻婚纱等需求也可约",
    features: [
      "根据需求定制方案",
      "专业灯光与辅助设备",
      "场景布置建议",
      "精修数量按需协商",
      "底片全部赠送",
    ],
    location: "拍摄内容：协商确定",
  },
];

// 提供道具
export const providedProps = [
  "仿真花",
  "大小喜字",
  "长条横幅",
  "头纱",
  "泡泡机",
];

// 常见问题
export const faqItems = [
  {
    question: "拍摄前需要准备什么？",
    answer:
      "提前和我确认拍摄日期、民政局以及想要的外景风格。女生可以带妆、准备自己喜欢的道具；服装建议浅色系或小白裙，更出片。我会提前发送拍摄小贴士。",
  },
  {
    question: "修图周期是多久？",
    answer:
      "当晚或第二天即可出精修。加急可协商。会先给几张小样确认色调风格，再统一修完全部。",
  },
  {
    question: "底片会全部给我吗？",
    answer:
      "会的！所有底片全部赠送，并且经过基础调色。精修之外的底片也可以自行二次创作。",
  },
  {
    question: "拍摄精修底片可以发平台吗？",
    answer:
      "默认可发平台用于作品展示。如果介意发布，请提前告知，我会尊重你的隐私选择。",
  },
  {
    question: "外景地点怎么确定？",
    answer:
      "民政局附近的公园、湖边、街景、车内都可以。杭州、绍兴我都有常拍路线推荐清单，也可以按你的想法来。",
  },
  {
    question: "遇到天气不好怎么办？",
    answer:
      "外景如遇恶劣天气可免费改期，提前沟通即可。民政局内景不受天气影响，也可以改为室内咖啡馆等方案。",
  },
  {
    question: "交通费和额外费用怎么算？",
    answer:
      "如果拍摄地距离太远或拍摄中遇到恶劣天气等特殊情况，可能会有额外费用，会提前沟通。",
  },
];

// ============================================
// 可约档期（Availability 组件数据）
// ⚠️ 此处的值只是「内置默认值」，网站运行时优先读取
// 后台发布的 availability.json（由「档期管理后台」一键发布）。
// 日常改档期请用后台，不要改这里。
// ============================================
export const availabilityConfig = {
  // 档期展示从哪个月开始（含当月）
  startMonth: "2026-08",
  // 一共展示几个月（含当月，往后顺延）
  totalMonths: 3,
  // 已约日期（金色日期=可约；写进去的日期会变成深灰已约）
  bookedDates: [] as string[],
  // 底部说明文字（可自定义，空字符串则不显示）
  note: "档期以微信确认为准",
};

// 摄影师信息（关于我区块）
export const aboutInfo = {
  heading: "关于我",
  avatar: "/photo/photos/avatar.webp",
  name: "冻梨摄影（Dlidex）",
  title: "独立摄影师 · 专注领证跟拍、订婚跟拍与婚礼记录",
  bio: [
    "嗨，我是冻梨摄影（Dlidex），常驻杭州、绍兴的独立摄影师。中国摄影师协会会员，在大厂工作，审美在线、性格外放的“超级 e 人”。",
    "专注于领证跟拍、订婚跟拍、婚礼记录、宝宝宴与各类写真。喜欢用自然光与多样场景，捕捉真实情绪，把你重要那天的仪式感与幸福瞬间定格下来。",
    "器材专业、道具齐全，拍摄前会和你充分沟通风格与流程，让你轻松出镜，摆姿势不尴尬。",
  ],
  stats: [
    { label: "跟拍经验", value: "3 年+" },
    { label: "累计客片", value: "50+ 对新人" },
    { label: "常驻城市", value: "杭州·绍兴" },
  ],
  equipment: [
    "全画幅佳能 R8",
    "大光圈定焦镜头群",
    "闪光灯等辅助设备",
  ],
};
