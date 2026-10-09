(function(){
  const rp=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n).replace(/\s/g,"");
  const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
  const cartKey="eksploreSumbaCart";
  const getCart=()=>JSON.parse(localStorage.getItem(cartKey)||"[]");
  const all=[...destinations,...homePopular,...umkmProducts];
  const find=id=>all.find(x=>x.id===id)||destinations[0];
  const toast=t=>{const el=$("#toast"); if(!el) return; el.textContent=t; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),1700)};

  function itemCard(item,mode="trip"){
    const detail=item.detail||item.id==="waingapu"?"detail.html":"detail.html";
    const img=item.img.startsWith("http")?item.img:`assets/${item.img}`;
    return `<article class="item-card" data-type="${item.type||item.category||""}">
      <button class="heart" type="button" data-favorite>♡</button>
      ${item.category?`<span class="badge">${item.category}</span>`:""}
      <a href="${detail}"><img src="${img}" alt="${item.name}"></a>
      <div class="item-body">
        <h3>${item.name}</h3>
        <p>${item.subtitle||""}</p>
        ${item.rating?`<p><span class="star">★</span> ${item.rating} (${item.reviews})</p>`:""}
        <div class="price">${rp(item.price)} <small>/ ${item.unit||"orang"}</small></div>
        <div class="card-actions">
          <a class="mini-btn" href="${detail}">Detail</a>
          <button class="mini-btn orange" type="button" data-add-cart="${item.id}">${mode==="planner"?"Tambah Rencana":"Tambah Trip"}</button>
        </div>
      </div>
    </article>`;
  }

  function renderCards(){
    const home=$('[data-render="home-popular"]'); if(home) home.innerHTML=homePopular.map(itemCard).join("");
    const market=$('[data-render="market"]'); if(market) market.innerHTML=destinations.map(itemCard).join("");
    const planner=$('[data-render="planner"]'); if(planner) planner.innerHTML=destinations.slice(0,8).map(x=>itemCard(x,"planner")).join("");
    const umkm=$('[data-render="umkm"]'); if(umkm) umkm.innerHTML=umkmProducts.map(x=>itemCard(x,"produk")).join("");
    const similar=$('[data-render="similar"]'); if(similar) similar.innerHTML=destinations.slice(1,5).map(itemCard).join("");
  }

  function renderTabs(){
    const tabs=$("#categoryTabs"); if(!tabs) return;
    const names=["Semua","Destinasi","Paket Wisata","Penginapan","Transportasi","Guide Lokal","Kuliner","Produk Lokal","Aktivitas"];
    const iconClass={
      "Semua":"grid",
      "Destinasi":"destination",
      "Paket Wisata":"package",
      "Penginapan":"bed",
      "Transportasi":"car",
      "Guide Lokal":"guide",
      "Kuliner":"food",
      "Produk Lokal":"shop",
      "Aktivitas":"activity"
    };
    tabs.innerHTML=names.map((name,i)=>`<button class="${i===0?"active":""}" type="button" data-cat="${name}"><span class="tab-icon ${iconClass[name]}"></span>${name}</button>`).join("");
    tabs.onclick=e=>{const b=e.target.closest("button"); if(!b) return; $$("#categoryTabs button").forEach(x=>x.classList.toggle("active",x===b)); filterMarket()};
  }

  function filterMarket(){
    const grid=$('[data-render="market"]'); if(!grid) return;
    const q=($("#marketSearch")?.value||"").toLowerCase();
    const cat=$("#categoryTabs .active")?.dataset.cat||"Semua";
    const sort=$("#sortSelect")?.value||"popular";
    let list=destinations.filter(x=>(cat==="Semua"||x.type===cat||x.category===cat)&&`${x.name} ${x.subtitle} ${x.category}`.toLowerCase().includes(q));
    if(sort==="low") list.sort((a,b)=>a.price-b.price);
    if(sort==="high") list.sort((a,b)=>b.price-a.price);
    if(sort==="popular") list.sort((a,b)=>Number(b.rating)-Number(a.rating));
    grid.innerHTML=list.map(itemCard).join("")||"<p>Data tidak ditemukan.</p>";
    const count=$("#resultCount"); if(count) count.textContent=`Menampilkan 1-${Math.min(12,list.length)} dari ${list.length} pengalaman`;
    bindDynamic();
  }

  function saveCart(c){localStorage.setItem(cartKey,JSON.stringify(c));renderCart()}
  function addCart(id){const c=getCart(); const ex=c.find(x=>x.id===id); ex?ex.qty++:c.push({id,qty:1}); saveCart(c); $("#cartDrawer")?.classList.add("open"); toast("Ditambahkan ke rencana")}
  function renderCart(){
    const d=$("#cartDrawer"); if(!d) return;
    const c=getCart(); const total=c.reduce((s,i)=>s+find(i.id).price*i.qty,0);
    d.innerHTML=`<div class="cart-head"><h2>Rencana Perjalanan</h2><button type="button" data-close-cart>Tutup</button></div>
      ${c.length?c.map(i=>{const p=find(i.id);return `<div class="cart-line"><b>${p.name}</b><br><span>${i.qty} x ${rp(p.price)}</span></div>`}).join(""):"<p>Belum ada rencana.</p>"}
      <p class="cart-total">Total: ${rp(total)}</p><button class="checkout-now" type="button" data-checkout>Konfirmasi Booking</button>`;
    d.querySelector("[data-close-cart]").onclick=()=>d.classList.remove("open");
    d.querySelector("[data-checkout]").onclick=()=>{if(!getCart().length){toast("Rencana masih kosong");return}toast("Booking simulasi berhasil");saveCart([]);d.classList.remove("open")};
  }

  function footer(){
    const f=$("#footer"); if(!f) return;
    f.innerHTML=`<div><img src="assets/logo/logo_final.svg.svg" alt=""><p>Media wisata lengkap untuk menjelajahi keindahan Sumba Timur. Rancang perjalanan impian Anda dengan mudah dalam satu platform terpercaya.</p></div>
    <div><b>Jelajahi</b><a href="explore.html">Destinasi</a><a href="planner.html">Paket Wisata</a><a href="explore.html">Transportasi</a><a href="explore.html">Kuliner</a><a href="explore.html">Produk Lokal</a></div>
    <div><b>Bantuan</b><a>Cara pemesanan</a><a>Pembayaran</a><a>Kebijakan Pembatalan</a><a>FAQ</a><a>Hubungi Kami</a></div>
    <div><b>Tentang kami</b><a>Tentang explore</a><a>Blog & Artikel</a><a>Karir</a><a>Mitra Lokal</a></div>
    <div><b>Newsletter</b><p>Dapatkan info & Promo menarik dari kami</p><form class="newsletter"><input placeholder="Masukan Email kamu"><button type="button">➜</button></form></div>`;
  }

  function bindDynamic(){
    $$("[data-add-cart]").forEach(b=>b.onclick=()=>addCart(b.dataset.addCart));
    $$("[data-favorite]").forEach(b=>b.onclick=()=>{b.classList.toggle("liked");b.textContent=b.classList.contains("liked")?"♥":"♡";toast("Favorit diperbarui")});
  }

  function bindStatic(){
    $$("[data-open-cart]").forEach(b=>b.onclick=()=>$("#cartDrawer")?.classList.add("open"));
    $("#marketSearch")?.addEventListener("input",filterMarket);
    $("#sortSelect")?.addEventListener("change",filterMarket);
    $("#smartFilter")?.addEventListener("click",()=>toast("Filter cerdas aktif"));
    $("#resetFilter")?.addEventListener("click",()=>{if($("#marketSearch")) $("#marketSearch").value=""; filterMarket(); toast("Filter direset")});
    $$("[data-info]").forEach(b=>b.onclick=()=>toast(b.dataset.info));
    const form=$("#loginForm");
    if(form) form.onsubmit=e=>{e.preventDefault(); localStorage.setItem("eksploreUser",$("#loginEmail").value); $("#authMessage").textContent="Login berhasil, mengarah ke Home..."; setTimeout(()=>location.href="index.html",700)};
    $("#registerDemo")?.addEventListener("click",()=>$("#authMessage").textContent="Mode daftar demo aktif. Data disimpan di LocalStorage.");
  }

  function initReveal(){
    const targets=[
      ".category-panel",
      ".work-section",
      ".steps-card",
      ".section-head",
      ".card-grid",
      ".service-strip",
      ".inspiration-grid"
    ];
    const nodes=targets.flatMap(sel=>[...document.querySelectorAll(sel)]);
    nodes.forEach(node=>node.classList.add("reveal"));
    if(!("IntersectionObserver" in window)){
      nodes.forEach(node=>node.classList.add("in-view"));
      return;
    }
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },{threshold:.14,rootMargin:"0px 0px -40px 0px"});
    nodes.forEach(node=>io.observe(node));
  }

  document.addEventListener("DOMContentLoaded",()=>{renderCards();renderTabs();footer();renderCart();bindDynamic();bindStatic();initReveal();});
})();
