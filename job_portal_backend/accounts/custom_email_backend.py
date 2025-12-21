
import smtplib
import socket
import ssl
from django.core.mail.backends.smtp import EmailBackend

class IPv4SMTP(smtplib.SMTP):
    """
    Custom SMTP class that forces IPv4 connection.
    """
    def _get_socket(self, host, port, timeout):
        # Create a socket using ONLY IPv4 (AF_INET)
        print(f"DEBUG: IPv4SMTP Connecting to {host}:{port} with timeout={timeout}")
        if self.debuglevel > 0:
            print(f'connect: attempting IPv4 connection to {host}:{port}')
        
        # Manually resolve to IPv4 to ensure we don't pick IPv6
        # (Though passing AF_INET to socket() usually handles it, connect() verifies)
        try:
            # We use socket.getaddrinfo with AF_INET to strictly get IPv4 addresses
            # This is robust against OS preference for IPv6
            addresses = socket.getaddrinfo(host, port, socket.AF_INET, socket.SOCK_STREAM)
            
            err = None
            for res in addresses:
                af, socktype, proto, canonname, sa = res
                sock = None
                try:
                    sock = socket.socket(af, socktype, proto)
                    if timeout is not None:
                        sock.settimeout(timeout)
                    if self.source_address:
                        sock.bind(self.source_address)
                    sock.connect(sa)
                    return sock
                except OSError as _:
                    err = _
                    if sock is not None:
                        sock.close()
            
            if err is not None:
                raise err
            else:
                raise OSError("No IPv4 address found for host")
                
        except Exception as e:
            if self.debuglevel > 0:
                print(f"IPv4 connection failed: {e}")
            raise

class IPv4SMTP_SSL(smtplib.SMTP_SSL):
    """
    Custom SMTP_SSL class that forces IPv4 connection.
    """
    def _get_socket(self, host, port, timeout):
        print(f"DEBUG: IPv4SMTP_SSL Connecting to {host}:{port} with timeout={timeout}")
        if self.debuglevel > 0:
            print(f'connect: attempting IPv4 SSL connection to {host}:{port}')
            
        # Same Ivn4 forcing logic as above
        addresses = socket.getaddrinfo(host, port, socket.AF_INET, socket.SOCK_STREAM)
        
        err = None
        for res in addresses:
            af, socktype, proto, canonname, sa = res
            sock = None
            try:
                sock = socket.socket(af, socktype, proto)
                if timeout is not None:
                    sock.settimeout(timeout)
                if self.source_address:
                    sock.bind(self.source_address)
                sock.connect(sa)
                
                # IMPORTANT: Wrap the socket with SSL context
                # This matches smtplib.SMTP_SSL._get_socket behavior
                server_hostname = self._host if self._host else host
                return self.context.wrap_socket(sock, server_hostname=server_hostname)
                
            except OSError as _:
                err = _
                if sock is not None:
                    sock.close()
        
        if err is not None:
            raise err
        else:
            raise OSError("No IPv4 address found for host")

class IPv4EmailBackend(EmailBackend):
    """
    A Django EmailBackend that forces IPv4 connections to avoid IPv6 timeouts
    triggered by 'Network is unreachable' errors in some environments.
    """
    def open(self):
        if self.connection:
            return False
            
        try:
            # Override the connection class based on security setting
            if self.use_ssl:
                connection_class = IPv4SMTP_SSL
            else:
                connection_class = IPv4SMTP
                
            # Instantiate our custom connection class
            self.connection = connection_class(
                host=self.host, 
                port=self.port, 
                timeout=self.timeout
            )
            
            # Additional setup that Django's EmailBackend usually does
            if not self.use_ssl and self.use_tls:
                # Python 3.12 removed keyfile/certfile args from starttls
                # Use context instead
                if self.ssl_certfile or self.ssl_keyfile:
                    import ssl
                    context = ssl.create_default_context()
                    context.load_cert_chain(self.ssl_certfile, self.ssl_keyfile)
                    self.connection.starttls(context=context)
                else:
                    self.connection.starttls()
                
            if self.username and self.password:
                self.connection.login(self.username, self.password)
                
            return True
        except OSError as e:
            if not self.fail_silently:
                raise
        except Exception as e:
            if not self.fail_silently:
                raise
                
        return False
