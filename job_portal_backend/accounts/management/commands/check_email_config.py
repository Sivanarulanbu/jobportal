from django.core.management.base import BaseCommand
from django.conf import settings
import socket
import ssl
import smtplib
import os

class Command(BaseCommand):
    help = 'Verify Email Configuration and Connectivity in Production'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("=== Email Configuration Diagnostic Tool ==="))
        
        # 1. Print Settings
        host = getattr(settings, 'EMAIL_HOST', 'Not Set')
        port = getattr(settings, 'EMAIL_PORT', 'Not Set')
        use_tls = getattr(settings, 'EMAIL_USE_TLS', 'Not Set')
        use_ssl = getattr(settings, 'EMAIL_USE_SSL', 'Not Set')
        user = getattr(settings, 'EMAIL_HOST_USER', 'Not Set')
        password = getattr(settings, 'EMAIL_HOST_PASSWORD', None)
        
        self.stdout.write(f"EMAIL_HOST: {host}")
        self.stdout.write(f"EMAIL_PORT: {port}")
        self.stdout.write(f"EMAIL_USE_TLS: {use_tls}")
        self.stdout.write(f"EMAIL_USE_SSL: {use_ssl}")
        self.stdout.write(f"EMAIL_HOST_USER: {user}")
        if password:
             self.stdout.write(f"EMAIL_HOST_PASSWORD: {'*' * len(password)} (Length: {len(password)})")
        else:
             self.stdout.write(self.style.ERROR("EMAIL_HOST_PASSWORD: [MISSING/EMPTY]"))

        # 2. Check Environment Variables (Production Check)
        self.stdout.write("\n=== Environment Variable Check ===")
        env_password = os.getenv('EMAIL_HOST_PASSWORD')
        if not env_password:
             self.stdout.write(self.style.WARNING("WARNING: 'EMAIL_HOST_PASSWORD' environment variable is NOT set."))
             if not password:
                 self.stdout.write(self.style.ERROR("CRITICAL: No password found in settings OR environment variables!"))
        else:
             self.stdout.write(self.style.SUCCESS("✓ 'EMAIL_HOST_PASSWORD' environment variable is present."))

        # 3. Connectivity Test
        self.stdout.write(f"\n=== Connectivity Test ({host}:{port}) ===")
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(10)
            sock.connect((host, int(port)))
            sock.close()
            self.stdout.write(self.style.SUCCESS(f"✓ TCP Connection to {host}:{port} successful."))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"✗ TCP Connection FAILED: {e}"))
            self.stdout.write(self.style.ERROR("Reason: Possible firewall block, incorrect host/port, or network down."))
            return

        # 4. SMTP Authentication Test
        self.stdout.write("\n=== SMTP Authentication Test ===")
        try:
            if use_ssl:
                server = smtplib.SMTP_SSL(host, int(port), timeout=15)
            else:
                server = smtplib.SMTP(host, int(port), timeout=15)
                if use_tls:
                    server.starttls()
            
            server.ehlo()
            self.stdout.write(self.style.SUCCESS("✓ Connected to SMTP Server"))
            
            if user and password:
                try:
                    server.login(user, password)
                    self.stdout.write(self.style.SUCCESS("✓ Authentication Successful!"))
                except smtplib.SMTPAuthenticationError as e:
                     self.stdout.write(self.style.ERROR(f"✗ Authentication FAILED: {e}"))
                     self.stdout.write(self.style.ERROR("Solution: Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD."))
                except Exception as e:
                     self.stdout.write(self.style.ERROR(f"✗ Login Error: {e}"))
            else:
                self.stdout.write(self.style.WARNING("Skipping login (credentials missing)."))
            
            server.quit()
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"✗ SMTP Connection Error: {e}"))

        self.stdout.write("\n=== Diagnosis Complete ===")
