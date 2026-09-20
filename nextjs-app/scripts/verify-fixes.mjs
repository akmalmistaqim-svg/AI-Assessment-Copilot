async function runTests() {
  const baseUrl = "http://localhost:3005";
  console.log("=== RUNNING SECURITY TESTS ===");

  // Test 1: POST /api/classes without valid session cookie
  console.log("\n[Test 1] POST /api/classes without cookie...");
  const resNoAuth = await fetch(`${baseUrl}/api/classes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Testing Class", semester: "Semester Genap 2025/2026" }),
  });
  console.log(`Status: ${resNoAuth.status} ${resNoAuth.statusText}`);
  const jsonNoAuth = await resNoAuth.json();
  console.log("Response:", jsonNoAuth);
  if (resNoAuth.status === 401) {
    console.log("-> PASS: Expected 401 Unauthorized returned!");
  } else {
    console.error("-> FAIL: Expected 401 but got", resNoAuth.status);
  }

  // Test 2: Login as mahasiswa
  console.log("\n[Test 2] Login as mahasiswa (mahasiswa@example.com)...");
  const resLoginMhs = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "mahasiswa@example.com", password: "password123" }),
  });
  const mhsCookies = resLoginMhs.headers.getSetCookie
    ? resLoginMhs.headers.getSetCookie()
    : [resLoginMhs.headers.get("set-cookie")];
  const mhsCookieHeader = mhsCookies.map((c) => c.split(";")[0]).join("; ");
  console.log(`Login status: ${resLoginMhs.status}, Cookie: ${mhsCookieHeader}`);

  // Test 3: Mahasiswa accessing /dashboard/dosen/classes
  console.log("\n[Test 3] Mahasiswa accessing /dashboard/dosen/classes directly via URL...");
  const resMhsAccessDosen = await fetch(`${baseUrl}/dashboard/dosen/classes`, {
    method: "GET",
    headers: { cookie: mhsCookieHeader },
    redirect: "manual",
  });
  console.log(`Status: ${resMhsAccessDosen.status}`);
  const locationHeader = resMhsAccessDosen.headers.get("location");
  console.log(`Redirect Location: ${locationHeader}`);
  if (
    resMhsAccessDosen.status >= 300 &&
    resMhsAccessDosen.status < 400 &&
    locationHeader?.includes("/dashboard/mahasiswa")
  ) {
    console.log("-> PASS: Successfully redirected to /dashboard/mahasiswa!");
  } else {
    console.error(
      "-> FAIL: Did not redirect to /dashboard/mahasiswa, got status:",
      resMhsAccessDosen.status,
      "Location:",
      locationHeader,
    );
  }

  // Test 4: Mahasiswa trying to POST /api/classes
  console.log("\n[Test 4] Mahasiswa attempting POST /api/classes directly...");
  const resMhsPost = await fetch(`${baseUrl}/api/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: mhsCookieHeader,
    },
    body: JSON.stringify({ name: "Mahasiswa Class", semester: "Semester Genap 2025/2026" }),
  });
  console.log(`Status: ${resMhsPost.status}`);
  const jsonMhsPost = await resMhsPost.json();
  console.log("Response:", jsonMhsPost);
  if (resMhsPost.status === 403) {
    console.log("-> PASS: Expected 403 Forbidden returned for mahasiswa role!");
  } else {
    console.error("-> FAIL: Expected 403 but got", resMhsPost.status);
  }

  // Test 5: Login as dosen & POST /api/classes
  console.log("\n[Test 5] Login as dosen (dosen@example.com) & POST /api/classes...");
  const resLoginDsn = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "dosen@example.com", password: "password123" }),
  });
  const dsnCookies = resLoginDsn.headers.getSetCookie
    ? resLoginDsn.headers.getSetCookie()
    : [resLoginDsn.headers.get("set-cookie")];
  const dsnCookieHeader = dsnCookies.map((c) => c.split(";")[0]).join("; ");

  const resDsnPost = await fetch(`${baseUrl}/api/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: dsnCookieHeader,
    },
    body: JSON.stringify({ name: "Dosen Class", semester: "Semester Genap 2025/2026" }),
  });
  console.log(`Status: ${resDsnPost.status}`);
  const jsonDsnPost = await resDsnPost.json();
  console.log("Response:", jsonDsnPost);
  if (resDsnPost.status === 201) {
    console.log("-> PASS: Dosen successfully created class (201 Created)!");
  } else {
    console.error("-> FAIL: Expected 201 but got", resDsnPost.status);
  }

  console.log("\n=== ALL TESTS FINISHED ===");
}

runTests().catch(console.error);
