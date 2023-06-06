(function() {
    "use strict";
    var e = {
        5739: function(e, t, a) {
            a.d(t, {
                T: function() {
                    return n
                }
            });
            const n = [0, 7, 14, 20, 27, 34, 40, 43, 46, 48, 51, 54, 56, 59, 62, 64, 67, 70, 72, 75, 78, 80, 83, 85, 88, 90, 93, 95, 98, 100]
        },
        7823: function(e, t, a) {
            var n = a(821)
              , r = a(2201)
              , o = a(3907);
            function s(e) {
                e.forEach((e=>{
                    if ((e.number <= 25 || e.number > 100) && e.answer == e.key && (e.score = 1),
                    26 == e.number || 27 == e.number) {
                        let t = e.answer.split(" ")
                          , a = e.key.split(" ");
                        e.answer == e.key ? e.score = 2 : 2 == t.length && (t[0] == a[1] && t[1] == a[0] && (e.score = 1),
                        t[0] != a[0] && t[1] != a[1] || (e.score = 1))
                    }
                }
                ))
            }
            var i = a(5739);
            const c = e=>localStorage.setItem("kimData", JSON.stringify(e))
              , l = ()=>JSON.parse(localStorage.getItem("kimData")) || null
              , u = ()=>localStorage.removeItem("kimData")
              , d = e=>e.reduce(((e,t)=>e + t.score), 0)
              , m = e=>i.T[e]
              , p = {
                state: ()=>({
                    kimData: l(),
                    index: null,
                    showResult: !1,
                    blankNumber: "2832503195017",
                    endExam: !1,
                    duration: null
                }),
                mutations: {
                    UPDATE_KIM_DATA(e) {
                        e.kimData = l()
                    },
                    SAVE_TASKS(e, t) {
                        e.kimData = t,
                        c(e.kimData),
                        e.showResult = !1,
                        e.endExam = !1,
                        e.index = null
                    },
                    SET_INDEX(e, t) {
                        e.index = t
                    },
                    SET_BLANK_NUMBER(e, t) {
                        e.blankNumber = t
                    },
                    SET_ANSWER(e, t) {
                        e.kimData.tasks[e.index].answer = t,
                        c(e.kimData)
                    },
                    NEXT_INDEX(e) {
                        if (e.index === e.kimData.tasks.length - 1)
                            return !1;
                        null === e.index ? e.index = 0 : e.index += 1
                    },
                    PREV_INDEX(e) {
                        if (null === e.index)
                            return !1;
                        0 === e.index ? e.index = null : e.index -= 1
                    },
                    BACK_TO_TASK(e, t) {
                        e.showResult = !e.showResult,
                        e.index = t
                    },
                    START_EXAM(e) {
                        e.kimData.realMode = !1
                    },
                    END_EXAM(e) {
                        e.showResult = !0,
                        e.endExam = !0,
                        u()
                    },
                    UPDATE_TIMER(e) {
                        e.kimData.time += 1,
                        c(e.kimData)
                    }
                },
                getters: {
                    task(e) {
                        let t = e.index;
                        return null === t ? null : e.kimData.tasks[t]
                    }
                },
                actions: {
                    loadKim({state: e, commit: t}, {kim: a, user: n}) {
                        return e.kimData = l(),
                        new Promise(((r,o)=>{
                            if (e.kimData && "-" == e.kimData.kim && "-" == a)
                                return void r();
                            let s = "-" == a ? "/variant/random" : `/variant/kim/${a}`;
                            window.axios.get(s).then((s=>{
                                const i = s.data;
                                i.saveResults && !n && o("authError"),
                                e.kimData && e.kimData.kim == a ? (i.tasks.forEach(((t,a)=>{
                                    t.number > 100 && (t.number = t.number - 100),
                                    t.answer = e.kimData.tasks[a] ? e.kimData.tasks[a].answer : "",
                                    t.score = 0
                                }
                                )),
                                i.time = e.kimData.time) : (i.tasks.forEach((e=>{
                                    e.number > 100 && (e.number = e.number - 100),
                                    e.answer = "",
                                    e.score = 0
                                }
                                )),
                                i.time = 0),
                                t("SAVE_TASKS", i),
                                r()
                            }
                            )).catch((()=>o("loadError")))
                        }
                        ))
                    },
                    loadCourseTask({commit: e}, {kim: t}) {
                        return new Promise(((a,n)=>{
                                const r = null;
                                window.axios.get(`/variant/kim/${t}`).then((t=>{
                                    const n = t.data;
                                    r ? n.tasks.forEach(((e,t)=>{
                                        e.answer = r.result[t] ? r.result[t].answer : "",
                                        e.score = 0,
                                        e.showVideo = !1
                                    }
                                    )) : n.tasks.forEach((e=>{
                                        e.answer = "",
                                        e.score = 0,
                                        e.showVideo = !1
                                    }
                                    )),
                                    e("SAVE_TASKS", n),
                                    a()
                                }
                                )).catch((e=>n(e)))
                        }
                        ))
                    },
                    sendResult({state: e}) {
                        const t = e.kimData;
                        if (s(t.tasks),
                        localStorage.getItem("token")) {
                            const a = t.tasks.map((({number: e, answer: t, key: a, taskId: n, score: r})=>({
                                number: e,
                                answer: t,
                                key: a,
                                taskId: n,
                                score: r
                            })));
                            let n = d(t.tasks)
                              , r = m(n);
                            const o = {
                                kim: "-" == t.kim ? 0 : t.kim,
                                result: a,
                                primaryScore: n,
                                secondaryScore: r,
                                duration: 6e4 * e.kimData.time
                            };
                            window.axios.get(`/result/kim/${o.kim}/uid`).then((e=>{
                                e.data && 0 != o.kim ? t.saveResults || window.axios.put(`/result/${e.data.id}`, o) : window.axios.post("/result", o)
                            }
                            ))
                        }
                    }
                }
            };
            var h = p;
            const f = e=>e.reduce(((e,t)=>e + t.score), 0)
              , v = e=>i.T[e]
              , k = {
                state: ()=>({
                    results: [],
                    student: null,
                    showStat: !0
                }),
                mutations: {
                    SAVE_RESULTS(e, t) {
                        e.results = t
                    },
                    CLEAR_RESULTS(e) {
                        e.results = []
                    },
                    SET_STUDENT(e, t) {
                        e.student = t
                    },
                    CLEAR_STUDENT(e) {
                        e.student = null
                    },
                    SORT_RESULTS(e, {key: t, order: a}) {
                        e.results.sort(((e,n)=>a ? e[t] > n[t] || !n[t] ? 1 : -1 : e[t] < n[t] || !e[t] ? 1 : -1))
                    },
                    CHANGE_SHOW_STAT(e) {
                        e.showStat = !e.showStat
                    }
                },
                actions: {
                    loadResultsByKim({commit: e}, t) {
                        window.axios.get(`/result/kim/${t}`).then((t=>{
                            t.data.sort(((e,t)=>e.name > t.name ? 1 : -1)),
                            e("SAVE_RESULTS", t.data)
                        }
                        ))
                    },
                    loadResultsByUid({commit: e}) {
                        window.axios.get("/result/uid").then((t=>e("SAVE_RESULTS", t.data)))
                    },
                    deleteResult({state: e}, t) {
                        window.axios.delete(`/result/${t}`).then((()=>{
                            let a = e.results.map((e=>e.id)).indexOf(t);
                            e.results.splice(a, 1)
                        }
                        ))
                    },
                    updateResults({state: e}) {
                        const t = e.results.map((e=>window.axios.put(`/result/${e.id}`, e)));
                        Promise.all(t).then((()=>alert("Результаты успешно обновлены")))
                    },
                    recheckAnswers({state: e, dispatch: t}, a) {
                        window.axios.get(`/variant/kim/${a}`).then((a=>{
                            const n = a.data
                              , r = n.tasks.map((e=>e.key));
                            e.results.forEach((e=>{
                                for (let t = 0; t < e.result.length; t++)
                                    e.result[t].score = 0,
                                    e.result[t].key = r[t];
                                s(e.result),
                                e.primaryScore = f(e.result),
                                e.secondaryScore = v(e.primaryScore)
                            }
                            )),
                            t("updateResults")
                        }
                        ))
                    }
                }
            };
            var b = k;
            const E = (0,
            o.MT)({
                modules: {
                    exam: h,
                    result: b
                },
                state: {
                    user: JSON.parse(localStorage.getItem("user")) || null,
                    adminscreen: 0
                },
                mutations: {
                    SET_ADMIN_SCREEN(e, t) {
                        e.adminscreen = t
                    },
                    AUTH(e, t) {
                        const a = {
                            name: `${t.last_name} ${t.first_name}`,
                            photo: t.photo_100,
                            v: 1.3,
                            admin: t.admin
                        };
                        e.user = a,
                        localStorage.setItem("user", JSON.stringify(a)),
                        localStorage.setItem("token", t.token)
                    },
                    LOGOUT(e) {
                        e.user = null,
                        localStorage.removeItem("user"),
                        localStorage.removeItem("token")
                    }
                }
            });
            var g = E
              , w = a(6154);
            a(7658);
            const S = e=>((0,
            n.pushScopeId)("data-v-43c1aabe"),
            e = e(),
            (0,
            n.popScopeId)(),
            e)
              , y = {
                class: "start-wrap"
            }
              , N = S((()=>(0,
            n.createElementVNode)("div", {
                class: "title"
            }, [(0,
            n.createElementVNode)("h1", null, "Демонстрационная версия станции КЕГЭ")], -1)))
              , x = {
                class: "nav"
            }
              , _ = {
                class: "nav-wrap"
            }
              , T = (0,
            n.createStaticVNode)('<div class="main" data-v-43c1aabe><p style="margin-top:0;" data-v-43c1aabe>Предлагаемая демонстрационная версия позволяет проводить тренировку экзамена по Информатике и ИКТ в компьютерной форме (КЕГЭ).</p><p data-v-43c1aabe>В проекте используются задачи с сайта <a href="http://kpolyakov.spb.ru/school/ege.htm" data-v-43c1aabe>К.Ю. Полякова</a>, а также авторские задачи.</p><p data-v-43c1aabe>По поводу добавления задач, вариантов, а также прочих пожеланий и замечаний просьба писать <a target="_blank" href="https://vk.com/cabanovalexey" data-v-43c1aabe>автору</a>.</p><p data-v-43c1aabe><span class="important" data-v-43c1aabe>06.06.2023</span> Новый вариант от <a href="https://vk.com/eugenyjobs" data-v-43c1aabe>Е. Джобса</a>! (<a href="/variant?kim=25027193" data-v-43c1aabe>Вариант</a>)</p><p data-v-43c1aabe><span class="important" data-v-43c1aabe>05.06.2023</span> Новый вариант от <a href="https://vk.com/id524753149" data-v-43c1aabe>Ильи Карпачева</a>! (<a href="/variant?kim=25026893" data-v-43c1aabe>Вариант</a>)</p><p data-v-43c1aabe><span class="important" data-v-43c1aabe>04.06.2023</span> Новый вариант от <a href="https://vk.com/wall-206191300_339" data-v-43c1aabe>Лёни Шастина</a>! (<a href="/variant?kim=25024686" data-v-43c1aabe>Вариант</a>)</p><p data-v-43c1aabe><span class="important" data-v-43c1aabe>03.06.2023</span> Новый вариант <a href="https://vk.com/wall-142628541_2634" data-v-43c1aabe>Danov 2306</a>! (<a href="/variant?kim=25026935" data-v-43c1aabe>Вариант</a>)</p><p data-v-43c1aabe><span class="important" data-v-43c1aabe>03.06.2023</span> Новый вариант от <a href="https://vk.com/lru__cache" data-v-43c1aabe>М. Шагитова</a>! (<a href="/variant?kim=25022997" data-v-43c1aabe>Вариант</a>)</p><p data-v-43c1aabe><span class="important" data-v-43c1aabe>02.06.2023</span> Новый вариант от <a href="https://vk.com/eugenyjobs" data-v-43c1aabe>Е. Джобса</a>! (<a href="/variant?kim=25026870" data-v-43c1aabe>Вариант</a>)</p></div>', 1)
              , A = {
                class: "footer"
            }
              , D = {
                style: {
                    "text-align": "center",
                    margin: "0"
                }
            };
            function V(e, t, a, r, o, s) {
                const i = (0,
                n.resolveComponent)("AppHeader");
                return (0,
                n.openBlock)(),
                (0,
                n.createElementBlock)("div", y, [(0,
                n.createVNode)(i, {
                    class: "header"
                }), N, (0,
                n.createElementVNode)("nav", x, [(0,
                n.createElementVNode)("div", _, [(0,
                n.createElementVNode)("p", {
                    onClick: t[0] || (t[0] = t=>e.$router.push("/task"))
                }, "База заданий"), (0,
                n.createElementVNode)("p", {
                    onClick: t[1] || (t[1] = t=>e.$router.push("/archive"))
                }, "Варианты"), (0,
                n.createElementVNode)("p", {
                    onClick: t[2] || (t[2] = t=>e.$router.push("/course"))
                }, "Открытый курс"), (0,
                n.createElementVNode)("p", {
                    onClick: t[3] || (t[3] = t=>e.$router.push("/jobs"))
                }, "Курс Е. Джобса"), (0,
                n.createElementVNode)("p", {
                    onClick: t[4] || (t[4] = e=>s.openFIPI())
                }, "Банк ФИПИ")])]), T, (0,
                n.createElementVNode)("div", A, [(0,
                n.createElementVNode)("p", D, [(0,
                n.withDirectives)((0,
                n.createElementVNode)("input", {
                    type: "text",
                    "onUpdate:modelValue": t[5] || (t[5] = e=>o.kim = e),
                    placeholder: "№ КИМ",
                    class: "kimNumber",
                    onKeyup: t[6] || (t[6] = (0,
                    n.withKeys)(((...e)=>s.startExam && s.startExam(...e)), ["enter"]))
                }, null, 544), [[n.vModelText, o.kim]]), (0,
                n.createElementVNode)("input", {
                    type: "button",
                    value: "Начать экзамен",
                    class: "btn",
                    onClick: t[7] || (t[7] = (...e)=>s.startExam && s.startExam(...e))
                })])])])
            }
            var C = a(8745)
              , I = {
                name: "startPage",
                components: {
                    AppHeader: C.Z
                },
                data() {
                    return {
                        kim: ""
                    }
                },
                methods: {
                    startExam() {
                        this.kim ? this.$router.push(`/variant?kim=${this.kim}`) : this.$router.push({
                            path: "/variant"
                        })
                    },
                    openFIPI() {
                        window.open("https://openfipi.devinf.ru/", "_blank")
                    }
                }
            }
              , O = a(3744);
            const R = (0,
            O.Z)(I, [["render", V], ["__scopeId", "data-v-43c1aabe"]]);
            var $ = R;
            window.axios = w.Z.create({
                baseURL: "https://kompege.ru/api/v1"
            }),
            window.axios.interceptors.request.use((e=>{
                let t = localStorage.getItem("token");
                return t && (e.headers["Authorization"] = `Bearer ${t}`),
                e
            }
            ), (e=>Promise.reject(e)));
            const B = ()=>a.e(136).then(a.bind(a, 4082))
              , L = ()=>a.e(625).then(a.bind(a, 8625))
              , j = ()=>a.e(280).then(a.bind(a, 3280))
              , P = ()=>a.e(968).then(a.bind(a, 4968))
              , U = ()=>a.e(213).then(a.bind(a, 8213))
              , M = ()=>a.e(565).then(a.bind(a, 5565))
              , K = ()=>a.e(858).then(a.bind(a, 6498))
              , H = ()=>a.e(139).then(a.bind(a, 2171))
              , F = ()=>a.e(831).then(a.bind(a, 9831))
              , X = ()=>a.e(150).then(a.bind(a, 6712))
              , Z = ()=>a.e(957).then(a.bind(a, 6957))
              , J = (e,t,a)=>{
                g.state.user ? a() : (alert("Необходима авторизация на сайте"),
                a("/"))
            }
              , q = [{
                path: "/",
                component: $
            }, {
                path: "/variant",
                component: B
            }, {
                path: "/task",
                component: M
            }, {
                path: "/archive",
                component: K
            }, {
                path: "/auth",
                component: F
            }, {
                path: "/course",
                component: H,
            }, {
                path: "/result",
                component: U,
                beforeEnter: J
            }, {
                path: "/create/task",
                component: L,
                beforeEnter: J
            }, {
                path: "/create/variant",
                component: j,
                beforeEnter: J
            }, {
                path: "/lk",
                component: P,
                beforeEnter: J
            }, {
                path: "/jobs",
                component: X,
            }, {
                path: "/jobs/admin",
                component: Z,
                beforeEnter: J
            }, {
                path: "/:pathMatch(.*)*",
                redirect: "/"
            }]
              , z = (0,
            r.p7)({
                history: (0,
                r.PO)(),
                routes: q
            });
            (0,
            n.createApp)().use(z).use(g).mount("#app")
        },
        8745: function(e, t, a) {
            a.d(t, {
                Z: function() {
                    return w
                }
            });
            var n = a(821)
              , r = a.p + "img/logo.2815aead.png";
            const o = e=>((0,
            n.pushScopeId)("data-v-77e0754c"),
            e = e(),
            (0,
            n.popScopeId)(),
            e)
              , s = {
                class: "header-wrap"
            }
              , i = {
                class: "half1"
            }
              , c = o((()=>(0,
            n.createElementVNode)("img", {
                class: "logo",
                src: r
            }, null, -1)))
              , l = {
                class: "name"
            }
              , u = ["src"]
              , d = {
                style: {
                    "margin-left": "5px",
                    cursor: "pointer"
                },
                fill: "none",
                height: "14",
                viewBox: "0 0 12 8",
                width: "14",
                xmlns: "http://www.w3.org/2000/svg"
            }
              , m = o((()=>(0,
            n.createElementVNode)("path", {
                "clip-rule": "evenodd",
                d: "M2.16 2.3a.75.75 0 011.05-.14L6 4.3l2.8-2.15a.75.75 0 11.9 1.19l-3.24 2.5c-.27.2-.65.2-.92 0L2.3 3.35a.75.75 0 01-.13-1.05z",
                fill: "#f0f0f0",
                "fill-rule": "evenodd"
            }, null, -1)))
              , p = [m]
              , h = {
                key: 0,
                class: "menu"
            }
              , f = {
                key: 1,
                class: "half2 auth-block"
            }
              , v = ["href"];
            function k(e, t, a, r, o, m) {
                const k = (0,
                n.resolveComponent)("router-link");
                return (0,
                n.openBlock)(),
                (0,
                n.createElementBlock)("div", null, [(0,
                n.createElementVNode)("div", s, [(0,
                n.createElementVNode)("div", i, [(0,
                n.createVNode)(k, {
                    to: "/"
                }, {
                    default: (0,
                    n.withCtx)((()=>[c])),
                    _: 1
                })]), m.user ? ((0,
                n.openBlock)(),
                (0,
                n.createElementBlock)("div", {
                    key: 0,
                    class: "half2",
                    onClick: t[1] || (t[1] = e=>o.show = !o.show)
                }, [(0,
                n.createElementVNode)("span", l, (0,
                n.toDisplayString)(m.user.name.split(" ")[1]), 1), (0,
                n.createElementVNode)("img", {
                    src: m.user.photo,
                    alt: "avatar",
                    class: "avatar"
                }, null, 8, u), ((0,
                n.openBlock)(),
                (0,
                n.createElementBlock)("svg", d, p)), (0,
                n.createVNode)(n.Transition, {
                    name: "fade"
                }, {
                    default: (0,
                    n.withCtx)((()=>[o.show ? ((0,
                    n.openBlock)(),
                    (0,
                    n.createElementBlock)("div", h, [(0,
                    n.createElementVNode)("p", null, [(0,
                    n.createVNode)(k, {
                        class: "menuLink",
                        to: "/lk"
                    }, {
                        default: (0,
                        n.withCtx)((()=>[(0,
                        n.createTextVNode)("Личный кабинет")])),
                        _: 1
                    })]), (0,
                    n.createElementVNode)("p", {
                        class: "exitLink",
                        onClick: t[0] || (t[0] = (...e)=>m.logout && m.logout(...e))
                    }, "Выйти")])) : (0,
                    n.createCommentVNode)("", !0)])),
                    _: 1
                })])) : ((0,
                n.openBlock)(),
                (0,
                n.createElementBlock)("div", f, [(0,
                n.createElementVNode)("a", {
                    // href: `https://oauth.vk.com/authorize?client_id=${o.appID}&display=popup&redirect_uri=${o.redirect}&response_type=code&v=5.131`,
                    class: "headerLink"
                }, "Вход", 8, v)]))])])
            }
            a(7658);
            var b = {
                name: "AppHeader",
                created() {
                    this.user && this.user.v && 1.3 != this.user.v && this.logout()
                },
                data() {
                    return {
                        show: !1,
                        appID: "7631884",
                        redirect: "https://kompege.ru/auth"
                    }
                },
                methods: {
                    auth() {
                        this.$store.commit("AUTH")
                    },
                    logout() {
                        this.$store.commit("LOGOUT"),
                        this.$router.push("/").catch((()=>{}
                        )),
                        this.show = !1
                    }
                },
                computed: {
                    user() {
                        return this.$store.state.user
                    }
                }
            }
              , E = a(3744);
            const g = (0,
            E.Z)(b, [["render", k], ["__scopeId", "data-v-77e0754c"]]);
            var w = g
        }
    }
      , t = {};
    function a(n) {
        var r = t[n];
        if (void 0 !== r)
            return r.exports;
        var o = t[n] = {
            exports: {}
        };
        return e[n].call(o.exports, o, o.exports, a),
        o.exports
    }
    a.m = e,
    function() {
        var e = [];
        a.O = function(t, n, r, o) {
            if (!n) {
                var s = 1 / 0;
                for (u = 0; u < e.length; u++) {
                    n = e[u][0],
                    r = e[u][1],
                    o = e[u][2];
                    for (var i = !0, c = 0; c < n.length; c++)
                        (!1 & o || s >= o) && Object.keys(a.O).every((function(e) {
                            return a.O[e](n[c])
                        }
                        )) ? n.splice(c--, 1) : (i = !1,
                        o < s && (s = o));
                    if (i) {
                        e.splice(u--, 1);
                        var l = r();
                        void 0 !== l && (t = l)
                    }
                }
                return t
            }
            o = o || 0;
            for (var u = e.length; u > 0 && e[u - 1][2] > o; u--)
                e[u] = e[u - 1];
            e[u] = [n, r, o]
        }
    }(),
    function() {
        a.n = function(e) {
            var t = e && e.__esModule ? function() {
                return e["default"]
            }
            : function() {
                return e
            }
            ;
            return a.d(t, {
                a: t
            }),
            t
        }
    }(),
    function() {
        a.d = function(e, t) {
            for (var n in t)
                a.o(t, n) && !a.o(e, n) && Object.defineProperty(e, n, {
                    enumerable: !0,
                    get: t[n]
                })
        }
    }(),
    function() {
        a.f = {},
        a.e = function(e) {
            return Promise.all(Object.keys(a.f).reduce((function(t, n) {
                return a.f[n](e, t),
                t
            }
            ), []))
        }
    }(),
    function() {
        a.u = function(e) {
            return "js/" + e + "." + {
                136: "24c4fc02",
                139: "a0d43e55",
                150: "23e2633f",
                213: "8eb4919f",
                280: "b4586e00",
                565: "bfd5cf10",
                625: "25ccf6d2",
                831: "5cacd56e",
                858: "b23aa772",
                957: "45aafd49",
                968: "5edd0c8f"
            }[e] + ".js"
        }
    }(),
    function() {
        a.miniCssF = function(e) {
            return "css/" + e + "." + {
                136: "063e0913",
                139: "b1fe5f72",
                150: "d5b5af2d",
                213: "440fbbfa",
                280: "7a9cb485",
                565: "973791fb",
                625: "46c22e36",
                831: "07479405",
                858: "29785df4",
                957: "a4cfbb70",
                968: "0cfef539"
            }[e] + ".css"
        }
    }(),
    function() {
        a.g = function() {
            if ("object" === typeof globalThis)
                return globalThis;
            try {
                return this || new Function("return this")()
            } catch (e) {
                if ("object" === typeof window)
                    return window
            }
        }()
    }(),
    function() {
        a.o = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
    }(),
    function() {
        var e = {}
          , t = "test:";
        a.l = function(n, r, o, s) {
            if (e[n])
                e[n].push(r);
            else {
                var i, c;
                if (void 0 !== o)
                    for (var l = document.getElementsByTagName("script"), u = 0; u < l.length; u++) {
                        var d = l[u];
                        if (d.getAttribute("src") == n || d.getAttribute("data-webpack") == t + o) {
                            i = d;
                            break
                        }
                    }
                i || (c = !0,
                i = document.createElement("script"),
                i.charset = "utf-8",
                i.timeout = 120,
                a.nc && i.setAttribute("nonce", a.nc),
                i.setAttribute("data-webpack", t + o),
                i.src = n),
                e[n] = [r];
                var m = function(t, a) {
                    i.onerror = i.onload = null,
                    clearTimeout(p);
                    var r = e[n];
                    if (delete e[n],
                    i.parentNode && i.parentNode.removeChild(i),
                    r && r.forEach((function(e) {
                        return e(a)
                    }
                    )),
                    t)
                        return t(a)
                }
                  , p = setTimeout(m.bind(null, void 0, {
                    type: "timeout",
                    target: i
                }), 12e4);
                i.onerror = m.bind(null, i.onerror),
                i.onload = m.bind(null, i.onload),
                c && document.head.appendChild(i)
            }
        }
    }(),
    function() {
        a.r = function(e) {
            "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }),
            Object.defineProperty(e, "__esModule", {
                value: !0
            })
        }
    }(),
    function() {
        a.p = "/"
    }(),
    function() {
        if ("undefined" !== typeof document) {
            var e = function(e, t, a, n, r) {
                var o = document.createElement("link");
                o.rel = "stylesheet",
                o.type = "text/css";
                var s = function(a) {
                    if (o.onerror = o.onload = null,
                    "load" === a.type)
                        n();
                    else {
                        var s = a && ("load" === a.type ? "missing" : a.type)
                          , i = a && a.target && a.target.href || t
                          , c = new Error("Loading CSS chunk " + e + " failed.\n(" + i + ")");
                        c.code = "CSS_CHUNK_LOAD_FAILED",
                        c.type = s,
                        c.request = i,
                        o.parentNode && o.parentNode.removeChild(o),
                        r(c)
                    }
                };
                return o.onerror = o.onload = s,
                o.href = t,
                a ? a.parentNode.insertBefore(o, a.nextSibling) : document.head.appendChild(o),
                o
            }
              , t = function(e, t) {
                for (var a = document.getElementsByTagName("link"), n = 0; n < a.length; n++) {
                    var r = a[n]
                      , o = r.getAttribute("data-href") || r.getAttribute("href");
                    if ("stylesheet" === r.rel && (o === e || o === t))
                        return r
                }
                var s = document.getElementsByTagName("style");
                for (n = 0; n < s.length; n++) {
                    r = s[n],
                    o = r.getAttribute("data-href");
                    if (o === e || o === t)
                        return r
                }
            }
              , n = function(n) {
                return new Promise((function(r, o) {
                    var s = a.miniCssF(n)
                      , i = a.p + s;
                    if (t(s, i))
                        return r();
                    e(n, i, null, r, o)
                }
                ))
            }
              , r = {
                143: 0
            };
            a.f.miniCss = function(e, t) {
                var a = {
                    136: 1,
                    139: 1,
                    150: 1,
                    213: 1,
                    280: 1,
                    565: 1,
                    625: 1,
                    831: 1,
                    858: 1,
                    957: 1,
                    968: 1
                };
                r[e] ? t.push(r[e]) : 0 !== r[e] && a[e] && t.push(r[e] = n(e).then((function() {
                    r[e] = 0
                }
                ), (function(t) {
                    throw delete r[e],
                    t
                }
                )))
            }
        }
    }(),
    function() {
        var e = {
            143: 0
        };
        a.f.j = function(t, n) {
            var r = a.o(e, t) ? e[t] : void 0;
            if (0 !== r)
                if (r)
                    n.push(r[2]);
                else {
                    var o = new Promise((function(a, n) {
                        r = e[t] = [a, n]
                    }
                    ));
                    n.push(r[2] = o);
                    var s = a.p + a.u(t)
                      , i = new Error
                      , c = function(n) {
                        if (a.o(e, t) && (r = e[t],
                        0 !== r && (e[t] = void 0),
                        r)) {
                            var o = n && ("load" === n.type ? "missing" : n.type)
                              , s = n && n.target && n.target.src;
                            i.message = "Loading chunk " + t + " failed.\n(" + o + ": " + s + ")",
                            i.name = "ChunkLoadError",
                            i.type = o,
                            i.request = s,
                            r[1](i)
                        }
                    };
                    a.l(s, c, "chunk-" + t, t)
                }
        }
        ,
        a.O.j = function(t) {
            return 0 === e[t]
        }
        ;
        var t = function(t, n) {
            var r, o, s = n[0], i = n[1], c = n[2], l = 0;
            if (s.some((function(t) {
                return 0 !== e[t]
            }
            ))) {
                for (r in i)
                    a.o(i, r) && (a.m[r] = i[r]);
                if (c)
                    var u = c(a)
            }
            for (t && t(n); l < s.length; l++)
                o = s[l],
                a.o(e, o) && e[o] && e[o][0](),
                e[o] = 0;
            return a.O(u)
        }
          , n = self["webpackChunktest"] = self["webpackChunktest"] || [];
        n.forEach(t.bind(null, 0)),
        n.push = t.bind(null, n.push.bind(n))
    }();
    var n = a.O(void 0, [998], (function() {
        return a(7823)
    }
    ));
    n = a.O(n)
}
)();
//# sourceMappingURL=app.5ad22ae6.js.map
