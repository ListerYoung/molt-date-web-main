//import EmailAuth from '@/components/EmailAuth';

//export default function Login() {
  //return <EmailAuth />;
//}


//import { useEffect } from "react";
//import EmailAuth from '@/components/EmailAuth';

//export default function Login() {
  // 自动跳转到 /match，跳过登录
  //useEffect(() => {
    //window.location.href = "/match";
  //}, []);

  // 保留原来的组件（或者直接 return null 也行）
  //return <EmailAuth />;
//}

import { useEffect } from "react";
import EmailAuth from '@/components/EmailAuth';

// 核心：访问登录页时，直接跳转到问卷页面，跳过所有登录步骤
export default function Login() {
  useEffect(() => {
    // 直接跳转到问卷路由，无需登录
    window.location.href = "/match";
  }, []);

  // 保留原组件（不影响跳转逻辑）
  return <EmailAuth />;
}