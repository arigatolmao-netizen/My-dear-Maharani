/* =====================================
   FOR MY MAHARANI ❤️
   script.js — navigation, confetti, interactions
===================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  let currentPage = 1;

  function nextPage(page){
    pages.forEach(p => p.classList.remove('active'));
    const el = document.getElementById('page'+page);
    if(el) el.classList.add('active');
    currentPage = page;
  }

  // expose for quick testing from console
  window.nextPage = nextPage;

  const yesButton = document.getElementById('yes');
  const noButton = document.getElementById('no');

  function launchConfetti({count = 180, spread = 80, duration = 3000} = {}){
    const w = window.innerWidth, h = window.innerHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.style.position = 'fixed'; canvas.style.left = 0; canvas.style.top = 0;
    canvas.style.pointerEvents = 'none'; canvas.style.zIndex = 9999;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const colors = ['#ff4f87','#ff8e9e','#ffd1e6','#ffb3c6','#ffefef','#fff1f6','#ffd6e0'];

    function createParticle(){
      const angle = (Math.PI/180)*(Math.random()*spread - spread/2 - 90);
      const speed = Math.random()*6 + 4;
      return {
        x: Math.random()*w,
        y: h + 10,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed*-1.2,
        size: Math.random()*6 + 4,
        color: colors[(Math.random()*colors.length)|0],
        rotation: Math.random()*360,
        vr: (Math.random()-0.5)*8,
        life: 0,
        ttl: Math.random()*(duration/10) + (duration/10)
      };
    }

    const particles = Array.from({length: count}, createParticle);
    let last = performance.now();
    let rafId;

    function update(dt){
      for(let i = particles.length-1; i>=0; i--){
        const p = particles[i];
        p.life += dt;
        p.vy += 0.05;
        p.vx += Math.sin((p.life + i)*0.01)*0.02;
        p.x += p.vx; p.y += p.vy; p.rotation += p.vr;
        if(p.y > h + 50 || p.life > duration/2 + p.ttl) particles.splice(i,1);
      }
    }

    function draw(){
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(p.rotation*Math.PI/180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
        ctx.restore();
      });
    }

    function loop(now){
      const dt = now - last; last = now;
      update(dt); draw();
      if(particles.length>0) rafId = requestAnimationFrame(loop);
      else { cancelAnimationFrame(rafId); canvas.remove(); }
    }

    rafId = requestAnimationFrame(loop);
    setTimeout(()=>{ particles.length = 0; }, duration + 800);
  }

  if(yesButton){
    yesButton.addEventListener('click', function(){
      try{
        launchConfetti({count:200, spread:80, duration:3000});
        yesButton.animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:450});
        // redirect after short delay
        setTimeout(()=>{ window.location.href = 'final.html'; }, 700);
      }catch(err){
        console.error('Error handling Yes click:', err);
      }
    });
  }

  if(noButton){
    noButton.addEventListener('mouseover', function(){
      const maxX = 220, maxY = 120;
      const rx = (Math.random()*maxX) - maxX/2;
      const ry = (Math.random()*maxY) - maxY/2;
      noButton.style.position = 'relative';
      noButton.style.left = rx + 'px';
      noButton.style.top = ry + 'px';
    });
  }

  // small hearts on click
  document.addEventListener('click', function(e){
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = (e.clientX - 10) + 'px';
    heart.style.top = (e.clientY - 10) + 'px';
    heart.style.fontSize = '20px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = 9998;
    heart.style.transition = 'transform 1s linear, opacity 1s linear';
    document.body.appendChild(heart);
    requestAnimationFrame(()=>{ heart.style.transform = 'translateY(-100px) scale(1.8)'; heart.style.opacity = '0'; });
    setTimeout(()=>heart.remove(), 1000);
  });

  // make pages fade usable
  pages.forEach(p=> p.style.transition = '.6s');

});
