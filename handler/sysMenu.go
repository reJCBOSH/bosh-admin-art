package handler

import (
    "bosh-admin/core/ctx"
    "bosh-admin/dao/dto"
    "bosh-admin/service"
)

type SysMenuHandler struct {
    svc    *service.SysMenuSvc
    jwtSvc *service.JWTSvc
}

func NewSysMenuHandler() *SysMenuHandler {
    return &SysMenuHandler{
        svc:    service.NewSysMenuSvc(),
        jwtSvc: service.NewJWTSvc(),
    }
}

func (h *SysMenuHandler) GetMenuTree(c *ctx.Context) {
    menuTree, err := h.svc.GetMenuTree()
    if c.HandlerError(err) {
        return
    }
    c.SuccessWithData(menuTree)
}

func (h *SysMenuHandler) GetMenuList(c *ctx.Context) {
    var req dto.GetMenuListReq
    msg, err := c.ValidateParams(&req)
    if c.HandlerError(err, msg) {
        return
    }
    menus, total, err := h.svc.GetMenuList(req.Title, req.PageNo, req.PageSize)
    if c.HandlerError(err) {
        return
    }
    var list []dto.MenuItem
    for _, menu := range menus {
        list = append(list, dto.MenuItem{
            BasicModel: menu.BasicModel,
            MenuBasicItem: dto.MenuBasicItem{
                Path:          menu.Path,
                Name:          menu.Name,
                Redirect:      menu.Redirect,
                Component:     menu.Component,
                ParentId:      menu.ParentId,
                Title:         menu.Title,
                Icon:          menu.Icon,
                DisplayOrder:  menu.DisplayOrder,
                ShowBadge:     menu.ShowBadge,
                ShowTextBadge: menu.ShowTextBadge,
                IsHide:        menu.IsHide,
                IsHideTab:     menu.IsHideTab,
                Link:          menu.Link,
                IsIframe:      menu.IsIframe,
                KeepAlive:     menu.KeepAlive,
                FixedTab:      menu.FixedTab,
                AuthMark:      menu.AuthMark,
            },
        })
    }
    c.SuccessWithList(list, total)
}

func (h *SysMenuHandler) GetMenuInfo(c *ctx.Context) {
    var req dto.IdReq
    msg, err := c.ValidateParams(&req)
    if c.HandlerError(err, msg) {
        return
    }
    menu, err := h.svc.GetMenuById(req.Id)
    if c.HandlerError(err) {
        return
    }
    data := dto.MenuItem{
        BasicModel: menu.BasicModel,
        MenuBasicItem: dto.MenuBasicItem{
            Path:          menu.Path,
            Name:          menu.Name,
            Redirect:      menu.Redirect,
            Component:     menu.Component,
            ParentId:      menu.ParentId,
            Title:         menu.Title,
            Icon:          menu.Icon,
            DisplayOrder:  menu.DisplayOrder,
            ShowBadge:     menu.ShowBadge,
            ShowTextBadge: menu.ShowTextBadge,
            IsHide:        menu.IsHide,
            IsHideTab:     menu.IsHideTab,
            Link:          menu.Link,
            IsIframe:      menu.IsIframe,
            KeepAlive:     menu.KeepAlive,
            FixedTab:      menu.FixedTab,
            AuthMark:      menu.AuthMark,
        },
    }
    c.SuccessWithData(data)
}

func (h *SysMenuHandler) AddMenu(c *ctx.Context) {
    var req dto.AddMenuReq
    msg, err := c.ValidateParams(&req)
    if c.HandlerError(err, msg) {
        return
    }
    err = h.svc.AddMenu(req)
    if c.HandlerError(err) {
        return
    }
    c.Success()
}

func (h *SysMenuHandler) EditMenu(c *ctx.Context) {
    var req dto.EditMenuReq
    msg, err := c.ValidateParams(&req)
    if c.HandlerError(err, msg) {
        return
    }
    err = h.svc.EditMenu(req)
    if c.HandlerError(err) {
        return
    }
    c.Success()
}

func (h *SysMenuHandler) DelMenu(c *ctx.Context) {
    var req dto.IdReq
    msg, err := c.ValidateParams(&req)
    if c.HandlerError(err, msg) {
        return
    }
    err = h.svc.DelMenu(req.Id)
    if c.HandlerError(err) {
        return
    }
    c.Success()
}

func (h *SysMenuHandler) GetAsyncRoutes(c *ctx.Context) {
    userClaims := h.jwtSvc.GetUserClaims(c)
    if userClaims == nil {
        c.UnAuthorized("用户信息失效")
        return
    }
    data, err := h.svc.GetAsyncRoutes(userClaims.RoleId, userClaims.RoleCode)
    if c.HandlerError(err) {
        return
    }
    c.SuccessWithData(data)
}
