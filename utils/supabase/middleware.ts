import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get user's role from JWT claims
    const { 
      data: { session },
    } = await supabase.auth.getSession();
    
    const userRole = session?.user?.app_metadata?.role || 'user';
    const isAdmin = userRole === 'admin';

    // protected user routes
    if (
      (request.nextUrl.pathname.startsWith("/protected") || 
       request.nextUrl.pathname.startsWith("/dashboard") ||
       request.nextUrl.pathname.startsWith("/cart") ||
       request.nextUrl.pathname.startsWith("/checkout")) && 
      !user
    ) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    // protected admin routes
    if (
      request.nextUrl.pathname.startsWith("/admin") && 
      (!user || !isAdmin)
    ) {
      // If user is logged in but not admin, redirect to dashboard
      if (user) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      // If not logged in, redirect to sign in
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // If authenticated user visits home, redirect to dashboard
    if (request.nextUrl.pathname === "/" && user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
    console.error('Error in middleware:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};

