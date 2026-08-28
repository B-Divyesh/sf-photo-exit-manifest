#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <sys/syscall.h>
#include <unistd.h>

static void record_attempt(const char *operation) {
  const char *path = getenv("PEM_NETWORK_LOG");
  if (path == NULL || *path == '\0') return;
  int fd = open(path, O_WRONLY | O_CREAT | O_APPEND, 0600);
  if (fd < 0) return;
  size_t length = 0;
  while (operation[length] != '\0') length++;
  (void)write(fd, operation, length);
  (void)write(fd, "\n", 1);
  (void)close(fd);
}

int socket(int domain, int type, int protocol) {
  if (domain == AF_INET || domain == AF_INET6) {
    record_attempt("socket");
    errno = EPERM;
    return -1;
  }
  return (int)syscall(SYS_socket, domain, type, protocol);
}

int connect(int fd, const struct sockaddr *address, socklen_t length) {
  if (address != NULL && (address->sa_family == AF_INET || address->sa_family == AF_INET6)) {
    record_attempt("connect");
    errno = EPERM;
    return -1;
  }
  return (int)syscall(SYS_connect, fd, address, length);
}

ssize_t sendto(int fd, const void *buffer, size_t size, int flags,
               const struct sockaddr *address, socklen_t length) {
  if (address != NULL && (address->sa_family == AF_INET || address->sa_family == AF_INET6)) {
    record_attempt("sendto");
    errno = EPERM;
    return -1;
  }
  return syscall(SYS_sendto, fd, buffer, size, flags, address, length);
}
