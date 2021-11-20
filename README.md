![img](<>)

# 🍴 Project

> COEAT

- **SOPT 29th SOPTKATHON, COEAT**
- 프로젝트 기간: 2021.11.20 ~

# 💙 Developers
| 주어진사랑 | 강한희 |
|:---:|:---------:|
| <img src="https://user-images.githubusercontent.com/68781598/142728963-4ed3ae56-cfd0-4658-8c31-af268834654b.png" width="200px" />  | <img src="https://user-images.githubusercontent.com/68781598/124511973-4d254d80-de12-11eb-96b8-60741367d22a.png" width="200px" />  |
| [ozzing](https://github.com/ozzing) | [kanghanhee](https://github.com/kanghanhee) |

# ☕ API 명세서
[API 명세서](https://www.notion.so/Api-dd08b5416f9b49db94bea87aee060587)

# 📂 폴더구조

- src
  - api
  - config
  - constants
  - db
  - lib
  - middlewares

# 🍹 코드 컨벤션

### **🖋 네이밍**

**함수 & 변수 & 인스턴스**

- 함수와 변수, 인스턴스에는 **camelCase**를 사용합니다.

### **:memo: 주석**

- `//` 를 단수행의 주석으로 사용합니다.
- `/** ... */` 를 복수행의 주석으로 사용합니다.

### **:herb: 기타**

- 줄의 끝에 반드시 ,(콤마)를 붙입니다. 마지막 요소에도 ,를 붙이는 것에 유의합시다.
- 함수끼리 1줄 개행합니다.
- 중괄호는 아래와 같은 형식으로 사용합니다.

```typescript
if (foo) {
  console.log(foo);
  /*
  ...
  */
}
```

# 🍙 Commit 전략

**코잇서버** 들의 **Git Commit Message Rules**

- 반영사항을 바로 확인할 수 있도록 작은 기능 하나라도 구현되면 커밋을 권장합니다.
- 기능 구현이 완벽하지 않을 땐, 각자 브랜치에 커밋을 해주세요.

### **:speech_balloon: 커밋 메시지 태그 모음**

    커밋 규칙을 지키지 않으면 commitlint에서 자동으로 에러가 발생합니다.

```
- feat    : 기능 (새로운 기능)
- update  : 코드 (코드 수정, 추가, 보완)
- docs    : 문서 (문서 추가, 수정, 삭제)
- chore   : 그 외 변경사항 (주석 추가,삭제 등)
```

### **:small_orange_diamond: 커밋 타입**

- `태그: 설명` 형식으로 커밋 메시지를 작성합니다.
- 태그는 영어를 쓰고 첫 문자는 소문자로 작성합니다.

좋은 예 >

```
  feat: 검색 api 추가
```

나쁜 예 >

```
  검색 api 추가
```


# 🍕 Git Branch 전략

**코잇서버** 들의 WorkFlow : **Gitflow Workflow**

  메인(main): 메인 브랜치

  개발(develop): 기능들의 통합 브랜치
    - feature 브랜치

- 기능 개발시 → feat/기능 으로 브랜치를 파서 관리합니다.
