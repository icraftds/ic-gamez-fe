<template>
  <section class="intro-section reveal">
    <div class="intro-content">
      <h2>Bersiap Untuk Karier Impian Anda</h2>
      <p>
        Lebih dari ribuan developer telah bergabung dengan komunitas IC
        Game-Z untuk memvalidasi keahlian mereka, berlatih untuk interview
        teknis, dan menemukan peluang baru. <br /><br />Sistem AI Mentor
        terintegrasi kami akan mendampingi Anda di setiap baris kode,
        memberikan petunjuk, dan membantu Anda belajar lebih cepat.
      </p>
      <router-link to="#" class="btn-learn-more"
        >Pelajari Cara Kerjanya <i class="fa-solid fa-arrow-right"></i
      ></router-link>
    </div>

    <div class="intro-mockup">
      <div class="mockup-window">
        <div class="mockup-header">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="mockup-body">
          <div class="mockup-sidebar">
            <div class="chat-msg">
              <img
                src="https://ui-avatars.com/api/?name=AI&background=9333ea&color=fff&bold=true"
                alt="AI"
              />
              <div>
                <strong>AI Mentor</strong>
                <p>
                  Halo! Biarkan saya tahu jika Anda butuh bantuan untuk soal
                  ini.
                </p>
              </div>
            </div>
            <div class="chat-msg user" style="margin-top: 10px">
              <img
                src="https://ui-avatars.com/api/?name=You&background=ec4899&color=fff&bold=true"
                alt="You"
              />
              <div>
                <strong>Anda</strong>
                <p>Bisa beri saya jawabannya?</p>
              </div>
            </div>
            <div class="chat-msg">
              <img
                src="https://ui-avatars.com/api/?name=AI&background=9333ea&color=fff&bold=true"
                alt="AI"
              />
              <div>
                <strong>AI Mentor</strong>
                <p>
                  Maaf, saya tidak bisa membocorkan jawabannya. Tapi cobalah
                  menggunakan
                  <span style="color: var(--primary)">Hash Map</span> untuk
                  mencapainya dalam O(N).
                </p>
              </div>
            </div>
          </div>
          <div class="mockup-editor">
            <div class="line-nums">
              1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9
            </div>
            <div class="code-content">
              <span class="comment"
                >// Hint: Type return [i, map.get(comp)]</span
              ><br /><br />
              <span class="keyword">function</span>
              <span class="func">twoSum</span>(nums, target) {<br />
              &nbsp;&nbsp;<span class="keyword">const</span> map =
              <span class="keyword">new</span>
              <span class="type">Map</span>();<br />
              &nbsp;&nbsp;<span class="keyword">for</span> (<span
                class="keyword"
                >let</span
              >
              i = <span class="num">0</span>; i &lt; nums.length; i++) {<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">const</span>
              comp = target - nums[i];<br />
              &nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword">if</span>
              (map.<span class="func">has</span>(comp)) {<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="keyword"
                >return</span
              >
              [map.<span class="func">get</span>(comp), i];<br />
              &nbsp;&nbsp;&nbsp;&nbsp;}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;map.<span class="func">set</span
              >(nums[i], i);<br />
              &nbsp;&nbsp;}<br />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// IntroSection Component
</script>
